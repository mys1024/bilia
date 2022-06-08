FROM denoland/deno:1.22.2

WORKDIR /app/

COPY ./ ./

RUN deno task cache

VOLUME [ "/app/output" ]

ENTRYPOINT [ "deno", "task", "run" ]

CMD [ "help" ]
