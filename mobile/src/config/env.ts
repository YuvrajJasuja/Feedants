export type EnvironmentMode = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  environment: EnvironmentMode;
  timeout: number;
}

const ENV_CONFIGS: Record<EnvironmentMode, Omit<EnvConfig, 'apiUrl'>> = {
  development: {
    environment: 'development',
    timeout: 10000,
  },
  staging: {
    environment: 'staging',
    timeout: 15000,
  },
  production: {
    environment: 'production',
    timeout: 15000,
  },
};

/**
 * Validates and retrieves environment configuration.
 * Throws a clear runtime error if EXPO_PUBLIC_API_URL is missing or invalid.
 */
export const getEnvConfig = (): EnvConfig => {
  const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;
  const envMode = (process.env.EXPO_PUBLIC_ENV || 'production') as EnvironmentMode;

  let apiUrl = rawApiUrl && !rawApiUrl.includes('YOUR_BACKEND_URL')
    ? rawApiUrl.trim()
    : 'http://localhost:5000/api';

  if (apiUrl.endsWith('/')) {
    apiUrl = apiUrl.slice(0, -1);
  }
  if (!apiUrl.endsWith('/api')) {
    apiUrl = `${apiUrl}/api`;
  }

  const baseConfig = ENV_CONFIGS[envMode] || ENV_CONFIGS.production;

  return {
    ...baseConfig,
    apiUrl,
  };
};

export const config = getEnvConfig();
