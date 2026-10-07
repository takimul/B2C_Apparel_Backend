# Verigo Essential API Test Suite V3

This version is repeatable:
- unique category/product names and slugs every run
- IDs captured only after successful creation
- login cookie preserved until final logout
- unauthorized tests clear the cookie first
- image/inquiry/banner failures print their response body
- category cleanup tests relation protection rather than expecting physical deletion

Run from the backend root:

```bash
npm run test:api
```

or:

```bash
npx newman run tests/postman/Verigo-Essential-API.postman_collection.json -e tests/postman/Verigo-Essential-Local.postman_environment.json
```
