module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'RoonyxLanding',
      script    : 'src/server.js',
      env: {},
      env_production : {
        NODE_ENV: 'production',
        PORT: 3010
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    staging: {
      user: "deploy",
      host: ["46.254.19.100"],
      port: "42777",
      ref: "origin/staging",
      repo: "ssh://git@gitlab.roonyx.team:2222/landing/frontend.git",
      path: "/srv/roonyx-landing",
      "post-deploy": "yarn install --frozen-lockfile && yarn build && pm2 reload ecosystem.config.js --env production",
    },
    production: {
      user: "deploy",
      host: ["188.93.209.165"],
      port: "28826",
      ref: "origin/master",
      repo: "ssh://git@gitlab.roonyx.team:2222/landing/frontend.git",
      path: "/srv/roonyx-landing",
      "post-deploy": "yarn install --frozen-lockfile && yarn build && pm2 reload ecosystem.config.js --env production",
    }
  }
};
