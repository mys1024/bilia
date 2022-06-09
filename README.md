# bilia

A bilibili archiver.

## Listen:

```
bilia-listen
Listen to a bilibili user

USAGE:
    bilia listen [OPTIONS] <UID>

OPTIONS:
    -h, --help          Prints help information
    -i, --interval      Interval (in seconds) of polling (default: 600)
    -o, --output-dir    Output directory (default: "./output")
    -t, --timezone      Timezone name, such as "Asia/Shanghai" (default: your local timezone)

ARGS:
    <UID>    The UID of bilibili user
```

## Docker image

Docker Hub:
[https://hub.docker.com/repository/docker/mys1024/bilia](https://hub.docker.com/repository/docker/mys1024/bilia)
