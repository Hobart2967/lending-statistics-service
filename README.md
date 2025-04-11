# Scalara Interview Code Challenge

A backend app that handles users' banking data and runs a few different calculations.

It does three main things: Updates the balance for each bank account, figures out how much each person is worth overall, and calculates the most they could borrow from their friends.

- [Preparation of your workspace](#preparation-of-your-workspace)
- [Clone and setup repository](#clone-and-setup-repository)
- [Repository structure](#repository-structure)
- [Tooling and Testing](#tooling-and-testing)
	- [Unit Tests](#unit-tests)
	- [Integration Tests](#integration-tests)
	- [Swagger UI](#swagger-ui)
- [CI/CD](#cicd)

- [⚠️⚠️ ToDos and Tech Debt](#️️-todos-and-tech-debt)
- [Notes](#️️notes)

![./docs/concept.excalidraw.png](./docs/concept.excalidraw.png)


### Preparation of your workspace

Required dependencies and tools are:

| Name                    | Description      | Source                                                        |
| ----------------------- | ---------------- | ------------------------------------------------------------- |
| Node.js                 | At least v22.5.1 | Node.js official Website, or: [asdf-vm](https://asdf-vm.com/) |
| Docker & Docker Compose | -                | -                                                             |

### Clone and setup repository

```sh
# Clone Repo
git clone git@github.com:Hobart2967/scalara-job

# Install required packages and set up project
yarn

# Boot required docker compose environment, including a database service.
cd infrastructure && docker-compose up -d
```

### Repository structure

| Path             | Description                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| ./compliance     | Contains Linting, Code Style etc. Configuration for all projects                                                                          |
| ./docs           | Contains docs & drawings about this domain/service                                                                                        |
| ./infrastructure | Contains well-needed infrastructural things for local development (e.g. third party services, databases)                                  |
| ./projects       | Contains all business logic, tests etc. It's a subdirectory because other parts for this business domain may follow (e.g. a web frontend) |

### Tooling and Testing

#### Unit Tests

This project uses unit tests. Run them using

```sh
cd projects/lend-stats-service
npm run test:cov
```

You will receive an inline coverage report as well.

#### Integration Tests

This project uses integration tests. It basically covers calling the APIs from outside using typical HTTP Requests. Run them using

```sh
cd projects/lend-stats-service
npm run test:e2e
```

##### Using VS Code

You can debug integration tests by jumping into a *.e2e-spec.ts file and hit F5. Set breakpoints etc as you wish and need.

#### Swagger UI

The API automatically exposes an OpenApi Specification. The endpoint listening would be http://localhost:3000.
There, you also have the possibility to test the API using a web frontend.

### CI/CD

This repository utilizes GitHub Actions as CI/CD Hoster. To run and test workflows locally, we recommand `act` - [see here](https://nektosact.com/introduction.html).

After installation of this tool (see its docs), you can run the workflow using

```sh
act push
```

from within the root folder of this repo.

## Common development Tasks

### Adding a new entity

1. Create a new file in the `projects/lend-stats-service/src/entities` folder
2. Add the entity to the `projects/lend-stats-service/src/app.module` file. Within there, you'll find the `databaseSourceFactory` call, which takes a list of entities to use with TypeORM.
3. As needed, create a entity-related repository.

## ⚠️⚠️ ToDos and Tech Debt

- Project uses faker-js for e2e tests. This is planned, but what was not planned, was to add it to the workspace root. Unfortunately, yarn did neither hoist nor localize the package into any of the node_modules directories from within the `./projects/lend-stats-service` folder and upwards. It was simply not there, while yarn telling `Hey! It's installed`.
I quit the research about that problem for time reasons and added it to this list.
- Some ToDos in the Code have been marked with "TODO". Those are steps that I would plan for the future if continuing to develop on this project.

## Notes

- Since I have never worked with Graph Databases, I chose Maria DB / MySQL for simplicity and implementation speed reasons. This does not mean I'd go for that in a business use case, because it may be worth looking at other solutions as well, as they may suit better.