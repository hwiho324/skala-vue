<script setup>
import { computed } from "vue";

const props = defineProps({
  cityWea: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select-card", "click-detail"]);

const withJosa = (word) => {
  if (!word) return "";

  const normalizedWord = word.trim();
  const lastChar = normalizedWord[normalizedWord.length - 1];
  const code = lastChar.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) return `${normalizedWord}를`;

  const hasBatchim = (code - 0xac00) % 28 !== 0;
  return `${normalizedWord}${hasBatchim ? "을" : "를"}`;
};

const weatherClass = computed(() => {
  const status = props.cityWea.status?.trim() ?? "";

  if (status.includes("소나기") || status.includes("비"))
    return "weather-card--rainy";
  if (status.includes("눈")) return "weather-card--snowy";
  if (status.includes("흐림")) return "weather-card--overcast";
  if (status.includes("구름")) return "weather-card--cloudy";
  if (status.includes("맑음")) return "weather-card--sunny";

  return "weather-card--default";
});

const weatherIcon = computed(() => {
  const status = props.cityWea.status?.trim() ?? "";

  if (status.includes("소나기") || status.includes("비")) return "🌧️";
  if (status.includes("눈")) return "❄️";
  if (status.includes("흐림")) return "☁️";
  if (status.includes("구름")) return "🌤️";
  return "☀️";
});

const selectCard = () => {
  emit("select-card", `${withJosa(props.cityWea.name)} 선택했습니다.`);
};

const showDetail = () => {
  emit(
    "click-detail",
    props.cityWea.name,
    props.cityWea.temp,
    props.cityWea.status,
    props.cityWea.humid,
    props.cityWea.pop,
    props.cityWea.ws,
  );
};
</script>

<template>
  <article
    class="weather-card"
    :class="weatherClass"
    tabindex="0"
    role="button"
    :aria-label="`${cityWea.name} 날씨 카드`"
    @click="selectCard"
    @keydown.enter="selectCard"
    @keydown.space.prevent="selectCard"
  >
    <div class="weather-card__shine" aria-hidden="true"></div>

    <header class="weather-card__header">
      <div>
        <p class="weather-card__region">대한민국</p>
        <h4>{{ cityWea.name }}</h4>
      </div>
      <span class="weather-card__icon" aria-hidden="true">{{
        weatherIcon
      }}</span>
    </header>

    <div class="weather-card__summary">
      <strong class="weather-card__temperature">{{ cityWea.temp }}°</strong>
      <div>
        <p class="weather-card__status">{{ cityWea.status }}</p>
        <span v-if="cityWea.temp >= 25" class="temperature-label"
          >더움 · 25°C 이상</span
        >
        <span v-else class="temperature-label">시원 · 25°C 미만</span>
      </div>
    </div>

    <dl class="weather-card__metrics">
      <div>
        <dt>습도</dt>
        <dd>{{ cityWea.humid }}%</dd>
      </div>
      <div>
        <dt>강수</dt>
        <dd>{{ cityWea.pop }}%</dd>
      </div>
      <div>
        <dt>풍속</dt>
        <dd>{{ cityWea.ws }}m/s</dd>
      </div>
    </dl>

    <button type="button" class="wea-detail" @click.stop="showDetail">
      상세 보기
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 250px;
  padding: 20px;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
  border: 1px solid rgb(255 255 255 / 52%);
  border-radius: 26px;
  box-shadow:
    0 18px 38px rgb(19 72 116 / 22%),
    inset 0 1px 0 rgb(255 255 255 / 70%),
    inset 0 -1px 0 rgb(255 255 255 / 12%);
  flex-direction: column;
  isolation: isolate;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
}

.weather-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 22px 45px rgb(19 72 116 / 28%),
    inset 0 1px 0 rgb(255 255 255 / 78%);
}

.weather-card:focus-visible {
  outline: 3px solid rgb(255 255 255 / 92%);
  outline-offset: 3px;
}

.weather-card::before,
.weather-card::after {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  content: "";
}

.weather-card::before {
  inset: 0;
  background:
    radial-gradient(circle at 78% 10%, rgb(255 255 255 / 35%), transparent 29%),
    linear-gradient(
      145deg,
      rgb(255 255 255 / 18%),
      transparent 38% 68%,
      rgb(255 255 255 / 8%)
    );
}

.weather-card::after {
  right: -42px;
  bottom: -70px;
  width: 175px;
  height: 175px;
  background: rgb(255 255 255 / 12%);
  border-radius: 50%;
  filter: blur(2px);
}

.weather-card__shine {
  position: absolute;
  top: 8px;
  right: 12%;
  left: 12%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 80%),
    transparent
  );
}

.weather-card__header,
.weather-card__summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.weather-card__region,
.weather-card__status,
.weather-card h4,
.temperature-label {
  margin: 0;
  text-shadow: 0 2px 8px rgb(24 73 108 / 24%);
}

.weather-card__region {
  margin-bottom: 2px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  opacity: 0.78;
}

.weather-card h4 {
  font-size: 1.55rem;
  line-height: 1.2;
}

.weather-card__icon {
  font-size: 2.15rem;
  filter: drop-shadow(0 5px 10px rgb(27 78 112 / 22%));
}

.weather-card__summary {
  align-items: flex-end;
  margin: 18px 0;
}

.weather-card__temperature {
  font-size: clamp(3.1rem, 6vw, 4.6rem);
  font-weight: 250;
  line-height: 0.9;
  letter-spacing: -0.06em;
  text-shadow: 0 5px 18px rgb(25 72 105 / 20%);
}

.weather-card__status {
  font-size: 1rem;
  font-weight: 800;
  text-align: right;
}

.temperature-label {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  text-align: right;
  opacity: 0.82;
}

.weather-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding: 8px;
  margin: auto 0 12px;
  background: rgb(255 255 255 / 13%);
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 15px;
}

.weather-card__metrics div {
  min-width: 0;
  text-align: center;
}

.weather-card__metrics dt {
  margin-bottom: 2px;
  font-size: 0.66rem;
  opacity: 0.72;
}

.weather-card__metrics dd {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.wea-detail {
  align-self: flex-end;
  padding: 8px 14px;
  color: #fff;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  cursor: pointer;
  background: rgb(255 255 255 / 18%);
  border: 1px solid rgb(255 255 255 / 48%);
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 35%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.wea-detail:hover,
.wea-detail:focus-visible {
  background: rgb(255 255 255 / 31%);
  outline: none;
}

.weather-card--sunny {
  background: linear-gradient(
    145deg,
    rgb(34 135 226 / 88%),
    rgb(110 197 246 / 74%)
  );
}

.weather-card--cloudy {
  background: linear-gradient(
    145deg,
    rgb(65 137 194 / 88%),
    rgb(159 205 231 / 75%)
  );
}

.weather-card--overcast {
  background: linear-gradient(
    145deg,
    rgb(58 112 159 / 90%),
    rgb(126 178 210 / 76%)
  );
}

.weather-card--rainy {
  background: linear-gradient(
    145deg,
    rgb(35 94 145 / 92%),
    rgb(85 153 194 / 79%)
  );
}

.weather-card--snowy {
  color: #19466a;
  background: linear-gradient(
    145deg,
    rgb(211 238 249 / 93%),
    rgb(137 199 232 / 82%)
  );
}

.weather-card--snowy .wea-detail {
  color: #19466a;
  border-color: rgb(255 255 255 / 72%);
}

.weather-card--default {
  background: linear-gradient(
    145deg,
    rgb(48 124 185 / 90%),
    rgb(115 190 229 / 76%)
  );
}

@media (prefers-reduced-motion: reduce) {
  .weather-card {
    transition: none;
  }
}
</style>
