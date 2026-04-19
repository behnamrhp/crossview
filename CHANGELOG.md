# Changelog

## [1.0.1](https://github.com/behnamrhp/crossview/compare/v1.0.0...v1.0.1) (2026-04-19)

### Bug Fixes

* **pipeline:** Bump package json version with semantic versioning ([7ddbff3](https://github.com/behnamrhp/crossview/commit/7ddbff3e853ac68699fcf5173ae0f2a7aefd2b24))

## 1.0.0 (2026-04-19)

### Features

* add ManagedResourceDefinitions and ManagedResourceActivationPolicies support ([640f715](https://github.com/behnamrhp/crossview/commit/640f715549ebea4ea100aaf71dc641c40962d444))
* add OCI registry support for Helm charts ([9b9abcd](https://github.com/behnamrhp/crossview/commit/9b9abcd9f92a0705478c6461a7d5d518a3faddee))
* add PostgreSQL SSL/TLS connection support ([a2f040c](https://github.com/behnamrhp/crossview/commit/a2f040c3604919c938a28005e6a5df827b70a6cf))
* add syntax highlighting and independent widget loading ([1a0cdc7](https://github.com/behnamrhp/crossview/commit/1a0cdc7c8d8d8c145e7faedd3b7355ffcab665ad))
* change service type from LoadBalancer to ClusterIP ([533ec29](https://github.com/behnamrhp/crossview/commit/533ec292ef3a0f93d86d93ba714f53322d0bdb37))
* enhance MRD/MRAP error handling with Crossplane 2.0 upgrade messaging ([dcd5a05](https://github.com/behnamrhp/crossview/commit/dcd5a05ec073f672c07d7e8237c7786f0bd2aad3))
* Helm chart improvements and ARM64 support ([5847ace](https://github.com/behnamrhp/crossview/commit/5847ace61ca677b4eb503ff3f6b767303604231e))
* implement pagination throughout the application ([eac39b4](https://github.com/behnamrhp/crossview/commit/eac39b4f73c8474ca42f3134ea8fdb2f3b074cbe))
* implement real-time Kubernetes resource watching with event-driven updates ([e8d3150](https://github.com/behnamrhp/crossview/commit/e8d315019e415dbba4cbd1a4a5018a355c24de86))
* make releases manual with controlled trigger ([3f4ff29](https://github.com/behnamrhp/crossview/commit/3f4ff298b88fb5a529e8ead314eceb5e938e7dfa))
* **pipeline:** Add automated semantic release bump versioning for release pipeline ([e5beccc](https://github.com/behnamrhp/crossview/commit/e5beccc63e26f5d56d8e9ae014dd90d01f2ebe3b))
* UI improvements, performance optimizations, and bug fixes ([78d9560](https://github.com/behnamrhp/crossview/commit/78d9560f5f29f22ce6f9de368c5c05d5772de7ff))
* **ui:** add version display and update indicator to sidebar footer ([61408a8](https://github.com/behnamrhp/crossview/commit/61408a82e6c3fccc55c8c220f6825106db6f6233))
* **ui:** support deep links for composite kind details ([4759e5a](https://github.com/behnamrhp/crossview/commit/4759e5a77a81e32474824109f784b49b474685a7))
* unified API design and managed resources caching ([fe4c068](https://github.com/behnamrhp/crossview/commit/fe4c06852854de4b3707bdf6dcdd119c34f97bc4))

### Bug Fixes

* Add configurable annotations for services ([0b9e53f](https://github.com/behnamrhp/crossview/commit/0b9e53fc4f97cb8722422ec99298e1770c54f62b))
* add emptyDir volume for postgres socket directory to resolve permission error ([4295399](https://github.com/behnamrhp/crossview/commit/4295399562b36b372b7bac7ee38396042506f31a))
* add engines field to package.json for Node.js version compatibility ([26a203d](https://github.com/behnamrhp/crossview/commit/26a203dda60bdd55487355636d2e4d1b77867b6d))
* Add extraEnv support for app and database containers ([dcac126](https://github.com/behnamrhp/crossview/commit/dcac12603570eb7a2cf4c1faa61d2df75374b338))
* add Helm registry login for OCI push authentication ([386219b](https://github.com/behnamrhp/crossview/commit/386219be38ad6c7f8059e14a1c0763cfcfc3001c))
* Add SecurityContext configuration for app and database pods ([bdc7063](https://github.com/behnamrhp/crossview/commit/bdc70635f9ee28f8504cc20b2335f3f250dd16c3))
* Add separate labels and annotations for database and app pods ([91568a7](https://github.com/behnamrhp/crossview/commit/91568a73e065034eb793d3b5a058796fc35829b5))
* add SSL properties to Helm values schema ([889723f](https://github.com/behnamrhp/crossview/commit/889723ff846ca3f0f30bdd73e021681690e446ea))
* Allow disabling namespace creation while using existing namespace ([9426943](https://github.com/behnamrhp/crossview/commit/94269439226b62c37099b1d93552745643c23f73))
* Allow listing Kubernetes contexts without active cluster ([11e56fa](https://github.com/behnamrhp/crossview/commit/11e56fa1ed4ef95638ba8df0c44a731f6acc0f8c))
* build only for amd64 to avoid QEMU ARM64 emulation issues ([4b4fb9e](https://github.com/behnamrhp/crossview/commit/4b4fb9e6999f5faa9b11f34518ee64a7d302aec9))
* check SARIF file exists before upload and upgrade to CodeQL v4 ([2170bc7](https://github.com/behnamrhp/crossview/commit/2170bc74585aaeaa8c9df7e3efa9da92d10d5d00))
* **ci:** enforce semantic versioning validation in release workflows ([ec011e5](https://github.com/behnamrhp/crossview/commit/ec011e52bb877a5e138daa0be6d52f0702890048))
* **ci:** finalize Helm OCI chart push in release workflow ([3171815](https://github.com/behnamrhp/crossview/commit/3171815043bd7511215410e7dbe1e93916dae939))
* **ci:** publish Helm chart with helm push; add chart extraManifests ([1ee1432](https://github.com/behnamrhp/crossview/commit/1ee14325f85e5f7cabaf29ceea9f76da3b102ff1))
* create PR for version bumps instead of pushing to protected main branch ([8805ec8](https://github.com/behnamrhp/crossview/commit/8805ec85af299ccbdfa81286246adb397caeee37))
* **docker:** build frontend and Go on host platform for multi-arch CI ([c222b48](https://github.com/behnamrhp/crossview/commit/c222b48967776654eeb5a29e56bb2305110fee0e))
* enable search functionality with server-side pagination and improve Providers page spacing ([f26fc88](https://github.com/behnamrhp/crossview/commit/f26fc88c0faeb6237f8ae4174f955a6de3431a7c))
* ensure rollup platform dependencies are installed in CI ([e8f9029](https://github.com/behnamrhp/crossview/commit/e8f9029b24dd6126481568917915063e23207e97))
* Helm chart workflow should only run after release, not on every push ([8c7ae98](https://github.com/behnamrhp/crossview/commit/8c7ae98cc2658d9f1cb42308f059ce51a9cea164))
* **helm:** validate release version against existing GitHub releases ([f417565](https://github.com/behnamrhp/crossview/commit/f417565b25c646faaf59264e3e9dc606c8345392))
* htlm ingress service reference ([f2e8202](https://github.com/behnamrhp/crossview/commit/f2e8202b83b8f80100d2444944749debbb5d0b81))
* improve logging, security contexts, OIDC callbacks, and in-cluster mode ([4191318](https://github.com/behnamrhp/crossview/commit/4191318f13aa0cfd68dd1d8ec5c1ec307c9ae379))
* **kubernetes:** defer RUnlock after conditional re-lock in GetContexts ([9174265](https://github.com/behnamrhp/crossview/commit/9174265ddc2f5a6ed0be3c91431902aa1a499d8f)), closes [#172](https://github.com/behnamrhp/crossview/issues/172)
* optimize composite resources loading and prevent unnecessary reloads ([da4b48f](https://github.com/behnamrhp/crossview/commit/da4b48fb7788b6f4e16ebe7884fc8ca737edfb2c))
* regenerate package-lock.json to resolve yaml version conflict ([29eface](https://github.com/behnamrhp/crossview/commit/29eface55b3d35e30611e108c2d341693ec1ff8d))
* regenerate package-lock.json to sync with package.json ([c9321f4](https://github.com/behnamrhp/crossview/commit/c9321f4dfdd6e6967efef0cfabff3cceed3daa3b))
* regenerate package-lock.json to sync with package.json ([42d4537](https://github.com/behnamrhp/crossview/commit/42d4537299ec06986e4fe205e42fdc44dea735d8))
* remove context sidebar completely in in-cluster mode and fix service targetPort ([b316143](https://github.com/behnamrhp/crossview/commit/b316143127c1d6b656eabf2995170dafed11c13a))
* Set PGDATA to subdirectory when persistence is enabled ([ef74d8b](https://github.com/behnamrhp/crossview/commit/ef74d8b0094326c94d7ea4d5ef87c77c0718c50e))
* Support referencing existing secret for DB credentials ([102a1aa](https://github.com/behnamrhp/crossview/commit/102a1aa76e8ea67c95cad4e6662c3e20b4cb9748))
* switch Dockerfile from Alpine to Debian for better multi-arch support ([95ee161](https://github.com/behnamrhp/crossview/commit/95ee1612a78ab190c8c1208e6da7d80d295fc7d6))
* update Helm chart to use dynamic DB_HOST and v-prefixed image tags ([cb2c588](https://github.com/behnamrhp/crossview/commit/cb2c58810949387de47b1ab3be9d49376f04dc19))
* update ORAS to 1.3.0 and add Helm config layer for 3.18+ compatibility ([9784a51](https://github.com/behnamrhp/crossview/commit/9784a51698ac725af456fe94fae7a41a60272ee3))
* use explicit docker.io registry URL and add retry for OCI push ([82d3dc7](https://github.com/behnamrhp/crossview/commit/82d3dc70420eff20cc5ab6e9282c3b0a04cb163a))
* use template value for postgres health check instead of env var expansion ([61f61fe](https://github.com/behnamrhp/crossview/commit/61f61fe77a328004f03f16d3e7a0b00c4d385f96))
* use unique branch name with run_id to avoid branch conflicts ([2ca2406](https://github.com/behnamrhp/crossview/commit/2ca24066984caf38864fbd066ba749b89e2e8bc5))
* **version-check:** compare prerelease versions correctly and pick highest release ([1855c65](https://github.com/behnamrhp/crossview/commit/1855c65bccadc840fd53e36bb59625f5485f60e1))

### Performance Improvements

* optimize data fetching for faster loading across all pages ([9879b5b](https://github.com/behnamrhp/crossview/commit/9879b5bd1543accf78e3a5667815a1cee90bf989))

### Reverts

* remove PR creation and version commit step ([8deaf1e](https://github.com/behnamrhp/crossview/commit/8deaf1ef608ae5b7420fa20fa675e417647a9306))
* Revert "Add database connection retry logic with exponential backoff" ([6d9f2c7](https://github.com/behnamrhp/crossview/commit/6d9f2c71ee43433406cd48bf7d7465b705322d91))
* Revert "Fix Helm OCI push authentication by copying Docker credentials to Helm registry config" ([076e6b6](https://github.com/behnamrhp/crossview/commit/076e6b6d34084f6a350ae4d09640e99b21dbc341))

# [3.9.0](https://github.com/crossplane-contrib/crossview/compare/v3.8.0...v3.9.0) (2026-04-13)


### Bug Fixes

* fix Crossplane v2 composite resource managed resource relation visualization ([f8cc7b1](https://github.com/crossplane-contrib/crossview/commit/f8cc7b15a861a247952f903773059aef303836d1))
* **ci:** enforce semantic versioning validation in release workflows ([ec011e5](https://github.com/crossplane-contrib/crossview/commit/ec011e52bb877a5e138daa0be6d52f0702890048))
* **version-check:** compare prerelease versions correctly and pick highest release ([1855c65](https://github.com/crossplane-contrib/crossview/commit/1855c65bccadc840fd53e36bb59625f5485f60e1))


### Features

* make releases manual with controlled trigger ([3f4ff29](https://github.com/crossplane-contrib/crossview/commit/3f4ff298b88fb5a529e8ead314eceb5e938e7dfa))
* **ui:** add version display and update indicator to sidebar footer ([61408a8](https://github.com/crossplane-contrib/crossview/commit/61408a82e6c3fccc55c8c220f6825106db6f6233))
* **ui:** support deep links for composite kind details ([4759e5a](https://github.com/crossplane-contrib/crossview/commit/4759e5a77a81e32474824109f784b49b474685a7))


### Other

* update GitHub issue templates ([ef268bd](https://github.com/crossplane-contrib/crossview/commit/ef268bdbd54df3037d38a0a79a0f5989696cd98e))
