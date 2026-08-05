import {
  faSun,
  faCloud,
  faCloudSun,
  faCloudRain,
  faCloudBolt,
  faSnowflake,
  faSmog,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

export const getWeatherIcon = (status = '', hasError = false) => {
  if (hasError) {
    return faTriangleExclamation
  }

  if (status.includes('뇌우') || status.includes('천둥')) {
    return faCloudBolt
  }

  if (status.includes('비') || status.includes('이슬비')) {
    return faCloudRain
  }

  if (status.includes('눈')) {
    return faSnowflake
  }

  if (status.includes('안개') || status.includes('박무')) {
    return faSmog
  }

  if (status.includes('구름') || status.includes('흐림')) {
    return faCloud
  }

  if (status.includes('맑')) {
    return faSun
  }

  return faCloudSun
}
