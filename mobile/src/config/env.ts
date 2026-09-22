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
  const envMode = (process.env.EXPO_PUBLIC_ENV || 'development') as EnvironmentMode;

  if (!rawApiUrl || rawApiUrl.includes('YOUR_BACKEND_URL')) {
    console.warn(
      '[ENV WARNING] EXPO_PUBLIC_API_URL is missing or unconfigured in .env file. Falling back to default local dev endpoint.'
    );
  }

  const apiUrl = rawApiUrl && !rawApiUrl.includes('YOUR_BACKEND_URL')
    ? rawApiUrl
    : 'http://localhost:5000/api';

  const baseConfig = ENV_CONFIGS[envMode] || ENV_CONFIGS.development;

  return {
    ...baseConfig,
    apiUrl,
  };
};

export const config = getEnvConfig();
