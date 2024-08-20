## Secrets and Environment Variables

Secrets and environment variables must be configured manualy on the dashboard of the cloudflare pages project.

## Deployment

-   ensure that

```shell
npm run deploy:live
```

-   Add bindings for D1 (preview and production) in the settings area (PROJECT_NAME -> Settings -> Functions)

## Drawbacks

-   Environment configurations in wrangler.toml doesnt work for cloudflare pages
    -   Configuration must be done in the dashboard
