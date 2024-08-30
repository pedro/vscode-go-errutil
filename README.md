# go-errutil

A little ghetto vscode extension that helps you wrap errors.

By default it maps `cmd+shift+e` to its `go-errutil.return` command, which writes a return statement for you.

For example, given:

```go
func a() (int, string, *p, error) {
	if err := x(); err != nil {
```

Running the command would type the return statement for you:

```go
func a() (int, string, *p, error) {
	if err := x(); err != nil {
    return 0, "", nil, errutil.With(err)
```

This is a super ghetto work in progress.
