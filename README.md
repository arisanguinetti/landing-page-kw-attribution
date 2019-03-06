# Getting Keyword Conversion Attribution

This Node.js small app connects Google Analytics API with Google Search Console API to try to detect correlations on keyword conversion attribution

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Installing

Install project dependencies by running:

```yarn
yarn
```

### Setting up environment variables

Create a `.env` file and set up your Google credentials and site URL. You can rename the sample file included in this repo.

```
mv .env.sample .env
```

Regarding getting the Google credentials, you can follow [this tutorial](https://flaviocopes.com/google-api-authentication/). Keep in mind you will not have to do the analytics steps, but use Google Search Console instead.

## Built With

- [Nodejs](https://nodejs.dev/)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Google API](https://github.com/googleapis/google-api-nodejs-client)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/arisanguinetti/landing-page-kw-attribution/tags).

## Authors

- **Ariel Sanguinetti** - _Initial work_ - [GitHub](https://github.com/arisanguinetti)

See also the list of [contributors](hhttps://github.com/arisanguinetti/landing-page-kw-attribution/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
