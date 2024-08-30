# go-errutil

A little VS Code extension that helps you wrap errors.

By default it maps `cmd+shift+e` to its `go-errutil.return` command, which writes a return statement for you.

For example, given:

```go
func a() (int, string, *p, error) {
  if err := x(); err != nil {
    // cursor here
  }
}
```

You can run that command to type the return statement for you:

```diff
func a() (int, string, *p, error) {
  if err := x(); err != nil {
+    return 0, "", nil, errutil.With(err)
  }
}
```

This is a super ghetto work in progress.

## Installation

Download `go-errutil.vsix` from releases, then in VS Code:

- open "Extensions"
- Click the three dots
- Install from VSIX
