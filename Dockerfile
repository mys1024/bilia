FROM denoland/deno

WORKDIR /app/

COPY ./ ./

RUN deno task cache

VOLUME [ "/app/output" ]

ENTRYPOINT [ "deno", "task", "run" ]

CMD [ "help" ]
