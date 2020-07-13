# Jest Reporter for Github Issues

## Background

Sometimes, you want a simple way to do alerting without the frills, and on the cheap.

Using Jest reporters is often time used to generate artefacts like HTML reports, but you can also utilise it for logging and applications such as gathering test results to pass them onto another entity.

This simple reporter raises alerts to Github Issues when Jest Tests fails has given me satisfying results.

## Applied

The way I have been using it is for tests that are triggered by a machine, either as the result of an event or on a scheduler - eg for synthetic tests [(example with Github actions)](.github/workflows/synthetics-example.yml).


## Set up

Add the following to your `package.json` file, et voilà!

```json
{
  "jest": {
    "reporters": [
      "./jest-reporter-github-issues.js"
    ]
  }
}
```

If a machine runs your tests, you can use the following options.

```json
{
  "scripts": {
    "test": "jest --ci --passWithNoTests --noStackTrace ."
  }
}
```

(NB: the outer curly brace should already be in your file)

## For best results

For maximum results, you should be notified of new issues via email.

Try the [account notifications page](https://github.com/settings/notifications), specifically the section under 'Issues' and make sure that you are receiving the notifications via email.