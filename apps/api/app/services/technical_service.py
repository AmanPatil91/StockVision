import math
from datetime import datetime
import pandas as pd
from ta.trend import EMAIndicator, SMAIndicator, MACD, ADXIndicator
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volatility import AverageTrueRange, BollingerBands
from ta.volume import OnBalanceVolumeIndicator, MFIIndicator, ChaikinMoneyFlowIndicator, VolumeWeightedAveragePrice

from app.schemas.technical import (
    IndicatorSnapshot,
    EMASnapshot,
    SMASnapshot,
    MACDSnapshot,
    BollingerBandsSnapshot,
    PivotPointsSnapshot,
    SignalsSnapshot,
    TechnicalSignal,
)
from app.repositories.stock_repository import StockRepository

class TechnicalAnalysisService:
    def __init__(self, stock_repository: StockRepository):
        self.stock_repo = stock_repository

    def _get_dataframe(self, ticker: str, timeframe: str = "1Y") -> pd.DataFrame:
        price_history = self.stock_repo.get_price_history(ticker, timeframe)
        if not price_history:
            raise ValueError(f"No price history found for {ticker}")
        
        df = pd.DataFrame([bar.model_dump() for bar in price_history])
        df['datetime'] = pd.to_datetime(df['time'], unit='s')
        df.set_index('datetime', inplace=True)
        df.sort_index(inplace=True)
        return df

    def get_indicators(self, ticker: str) -> IndicatorSnapshot:
        df = self._get_dataframe(ticker, "1Y")
        
        # Calculate Indicators
        close = df['close']
        high = df['high']
        low = df['low']
        volume = df['volume']

        # EMA
        ema_20 = EMAIndicator(close, window=20).ema_indicator().iloc[-1]
        ema_50 = EMAIndicator(close, window=50).ema_indicator().iloc[-1]
        ema_200 = EMAIndicator(close, window=200).ema_indicator().iloc[-1]

        # SMA
        sma_20 = SMAIndicator(close, window=20).sma_indicator().iloc[-1]
        sma_50 = SMAIndicator(close, window=50).sma_indicator().iloc[-1]
        sma_200 = SMAIndicator(close, window=200).sma_indicator().iloc[-1]

        # MACD
        macd_indicator = MACD(close)
        macd = macd_indicator.macd().iloc[-1]
        macd_signal = macd_indicator.macd_signal().iloc[-1]
        macd_hist = macd_indicator.macd_diff().iloc[-1]

        # ADX
        adx = ADXIndicator(high, low, close).adx().iloc[-1]

        # RSI
        rsi = RSIIndicator(close).rsi().iloc[-1]

        # MFI
        mfi = MFIIndicator(high, low, close, volume).money_flow_index().iloc[-1]

        # ATR
        atr = AverageTrueRange(high, low, close).average_true_range().iloc[-1]

        # Bollinger Bands
        bb = BollingerBands(close)
        bb_high = bb.bollinger_hband().iloc[-1]
        bb_mid = bb.bollinger_mavg().iloc[-1]
        bb_low = bb.bollinger_lband().iloc[-1]

        # VWAP
        vwap = VolumeWeightedAveragePrice(high, low, close, volume).volume_weighted_average_price().iloc[-1]

        # OBV
        obv = OnBalanceVolumeIndicator(close, volume).on_balance_volume().iloc[-1]

        # CMF
        cmf = ChaikinMoneyFlowIndicator(high, low, close, volume).chaikin_money_flow().iloc[-1]

        # Pivot Points (Standard formula using previous day data)
        # Using the last completed bar (could be today if intraday, but typical PP uses previous day's HLC)
        if len(df) > 1:
            prev_high = df['high'].iloc[-2]
            prev_low = df['low'].iloc[-2]
            prev_close = df['close'].iloc[-2]
            
            pp = (prev_high + prev_low + prev_close) / 3
            r1 = (2 * pp) - prev_low
            s1 = (2 * pp) - prev_high
            r2 = pp + (prev_high - prev_low)
            s2 = pp - (prev_high - prev_low)
            r3 = prev_high + 2 * (pp - prev_low)
            s3 = prev_low - 2 * (prev_high - pp)
        else:
            pp = r1 = s1 = r2 = s2 = r3 = s3 = None

        def _safe_float(val) -> float | None:
            if val is None or math.isnan(val):
                return None
            return float(val)

        return IndicatorSnapshot(
            ticker=ticker,
            updated_at=datetime.utcnow().isoformat() + "Z",
            ema=EMASnapshot(
                ema_20=_safe_float(ema_20),
                ema_50=_safe_float(ema_50),
                ema_200=_safe_float(ema_200),
            ),
            sma=SMASnapshot(
                sma_20=_safe_float(sma_20),
                sma_50=_safe_float(sma_50),
                sma_200=_safe_float(sma_200),
            ),
            macd=MACDSnapshot(
                macd=_safe_float(macd),
                signal=_safe_float(macd_signal),
                histogram=_safe_float(macd_hist),
            ),
            adx=_safe_float(adx),
            rsi=_safe_float(rsi),
            mfi=_safe_float(mfi),
            atr=_safe_float(atr),
            bollinger_bands=BollingerBandsSnapshot(
                high_band=_safe_float(bb_high),
                mid_band=_safe_float(bb_mid),
                low_band=_safe_float(bb_low),
            ),
            vwap=_safe_float(vwap),
            obv=_safe_float(obv),
            cmf=_safe_float(cmf),
            pivot_points=PivotPointsSnapshot(
                pp=_safe_float(pp),
                r1=_safe_float(r1),
                r2=_safe_float(r2),
                r3=_safe_float(r3),
                s1=_safe_float(s1),
                s2=_safe_float(s2),
                s3=_safe_float(s3),
            )
        )

    def get_signals(self, ticker: str) -> SignalsSnapshot:
        indicators = self.get_indicators(ticker)
        df = self._get_dataframe(ticker, "1Y")
        close_price = df['close'].iloc[-1]
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        signals: list[TechnicalSignal] = []
        buy_score = 0
        sell_score = 0
        
        # 1. RSI Overbought / Oversold
        if indicators.rsi is not None:
            if indicators.rsi > 70:
                signals.append(TechnicalSignal(name="RSI Overbought", category="Momentum", indicator="RSI", signal="SELL", strength="High" if indicators.rsi > 80 else "Medium", value=indicators.rsi, description="RSI indicates overbought conditions.", timestamp=timestamp))
                sell_score += 1
            elif indicators.rsi < 30:
                signals.append(TechnicalSignal(name="RSI Oversold", category="Momentum", indicator="RSI", signal="BUY", strength="High" if indicators.rsi < 20 else "Medium", value=indicators.rsi, description="RSI indicates oversold conditions.", timestamp=timestamp))
                buy_score += 1
                
        # 2. MACD Bullish / Bearish Cross
        if indicators.macd.macd is not None and indicators.macd.signal is not None and len(df) > 1:
            macd_indicator = MACD(df['close'])
            macd_series = macd_indicator.macd()
            signal_series = macd_indicator.macd_signal()
            
            curr_macd = macd_series.iloc[-1]
            curr_sig = signal_series.iloc[-1]
            prev_macd = macd_series.iloc[-2]
            prev_sig = signal_series.iloc[-2]
            
            if prev_macd <= prev_sig and curr_macd > curr_sig:
                signals.append(TechnicalSignal(name="MACD Bullish Cross", category="Momentum", indicator="MACD", signal="BUY", strength="High", value=curr_macd, description="MACD line crossed above the signal line.", timestamp=timestamp))
                buy_score += 2
            elif prev_macd >= prev_sig and curr_macd < curr_sig:
                signals.append(TechnicalSignal(name="MACD Bearish Cross", category="Momentum", indicator="MACD", signal="SELL", strength="High", value=curr_macd, description="MACD line crossed below the signal line.", timestamp=timestamp))
                sell_score += 2

        # 3. Golden Cross / Death Cross
        if indicators.sma.sma_50 is not None and indicators.sma.sma_200 is not None and len(df) > 1:
            sma50_series = SMAIndicator(df['close'], window=50).sma_indicator()
            sma200_series = SMAIndicator(df['close'], window=200).sma_indicator()
            
            curr_sma50 = sma50_series.iloc[-1]
            curr_sma200 = sma200_series.iloc[-1]
            prev_sma50 = sma50_series.iloc[-2]
            prev_sma200 = sma200_series.iloc[-2]
            
            if prev_sma50 <= prev_sma200 and curr_sma50 > curr_sma200:
                signals.append(TechnicalSignal(name="Golden Cross", category="Trend", indicator="SMA", signal="BUY", strength="High", value=curr_sma50, description="50-day SMA crossed above 200-day SMA.", timestamp=timestamp))
                buy_score += 3
            elif prev_sma50 >= prev_sma200 and curr_sma50 < curr_sma200:
                signals.append(TechnicalSignal(name="Death Cross", category="Trend", indicator="SMA", signal="SELL", strength="High", value=curr_sma50, description="50-day SMA crossed below 200-day SMA.", timestamp=timestamp))
                sell_score += 3
                
        # 4. Bollinger Breakout
        if indicators.bollinger_bands.high_band is not None and indicators.bollinger_bands.low_band is not None:
            if close_price > indicators.bollinger_bands.high_band:
                signals.append(TechnicalSignal(name="Bollinger Breakout (Up)", category="Volatility", indicator="BB", signal="BUY", strength="Medium", value=close_price, description="Price closed above the upper Bollinger Band.", timestamp=timestamp))
                buy_score += 1
            elif close_price < indicators.bollinger_bands.low_band:
                signals.append(TechnicalSignal(name="Bollinger Breakout (Down)", category="Volatility", indicator="BB", signal="SELL", strength="Medium", value=close_price, description="Price closed below the lower Bollinger Band.", timestamp=timestamp))
                sell_score += 1

        # 5. Volume Breakout
        current_volume = df['volume'].iloc[-1]
        avg_volume = df['volume'].rolling(window=20).mean().iloc[-1]
        if current_volume > avg_volume * 1.5:
            direction = "BUY" if close_price > df['open'].iloc[-1] else "SELL"
            signals.append(TechnicalSignal(name="Volume Breakout", category="Volume", indicator="Volume", signal=direction, strength="Medium", value=current_volume, description=f"Volume is {current_volume/avg_volume:.1f}x higher than 20-day average.", timestamp=timestamp))
            if direction == "BUY":
                buy_score += 1
            else:
                sell_score += 1

        # 6. EMA Trend
        if indicators.ema.ema_20 is not None and indicators.ema.ema_50 is not None:
            if close_price > indicators.ema.ema_20 and indicators.ema.ema_20 > indicators.ema.ema_50:
                signals.append(TechnicalSignal(name="Bullish EMA Alignment", category="Trend", indicator="EMA", signal="BUY", strength="Medium", value=close_price, description="Price > EMA20 > EMA50", timestamp=timestamp))
                buy_score += 1
            elif close_price < indicators.ema.ema_20 and indicators.ema.ema_20 < indicators.ema.ema_50:
                signals.append(TechnicalSignal(name="Bearish EMA Alignment", category="Trend", indicator="EMA", signal="SELL", strength="Medium", value=close_price, description="Price < EMA20 < EMA50", timestamp=timestamp))
                sell_score += 1

        # 7. ADX Trend Strength
        if indicators.adx is not None:
            if indicators.adx > 25:
                # ADX > 25 indicates a strong trend, but we need to know the direction.
                # Simplification: use close vs SMA50
                direction = "BUY" if indicators.sma.sma_50 and close_price > indicators.sma.sma_50 else "SELL"
                signals.append(TechnicalSignal(name="Strong Trend (ADX)", category="Trend", indicator="ADX", signal=direction, strength="High", value=indicators.adx, description="ADX > 25 indicates a strong prevailing trend.", timestamp=timestamp))
                if direction == "BUY":
                    buy_score += 1
                else:
                    sell_score += 1

        # Determine TechnicalSummary metrics
        trend = "Neutral"
        if buy_score > sell_score: trend = "Bullish"
        elif sell_score > buy_score: trend = "Bearish"

        momentum = "Neutral"
        if indicators.rsi and indicators.rsi > 60: momentum = "Bullish"
        elif indicators.rsi and indicators.rsi < 40: momentum = "Bearish"

        vol_category = "Average"
        if current_volume > avg_volume * 1.5: vol_category = "High"
        elif current_volume < avg_volume * 0.5: vol_category = "Low"

        volatility = "Average"
        if indicators.atr is not None:
            atr_pct = indicators.atr / close_price
            if atr_pct > 0.03: volatility = "High"
            elif atr_pct < 0.01: volatility = "Low"

        # Determine overall signal
        total_signals = buy_score + sell_score
        overall_signal = "NEUTRAL"
        if total_signals > 0:
            buy_ratio = buy_score / total_signals
            if buy_ratio >= 0.7:
                overall_signal = "STRONG_BUY"
            elif buy_ratio > 0.5:
                overall_signal = "BUY"
            elif buy_ratio <= 0.3:
                overall_signal = "STRONG_SELL"
            elif buy_ratio < 0.5:
                overall_signal = "SELL"
                
        from app.schemas.technical import TechnicalSummary
        summary = TechnicalSummary(
            trend=trend,
            momentum=momentum,
            volume=vol_category,
            volatility=volatility,
            support=indicators.pivot_points.s1,
            resistance=indicators.pivot_points.r1,
            overall_rating=overall_signal
        )

        return SignalsSnapshot(
            ticker=ticker,
            updated_at=timestamp,
            summary=summary,
            signals=signals
        )
