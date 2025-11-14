This is a [Next.js](https://nextjs.org/) project initiated by Jan.

## Getting Start

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.‘

### Build Image and Deploy
Enter `docker` folder, then run:
```bash
docker compose build
docker compose up -d
docker compose down
```
to mange the build and status of images. 

To find the tutorial on uploading and distributing images, please look for the `shell.sh` file.

### Runtime Considerations
Before running the images, please create a clean folder to place the `docker-compose.yml`, then execute `docker compose up` to monitor whether everything is configured correctly.

After successful startup, a `data` folder should have been created in the folder, where all the persistent file will be automatically maintained. DO NOT DELETE or MODIFY any FILES INSIDE.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

