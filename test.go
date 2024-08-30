package main

func main() {
	if err := x(); err != nil {
		panic(err)
	}
}

type s struct{}

func a() (n int, s string, p *s, err error) {
	if err := x(); err != nil {
		return 0, "", nil, errutil.With(err)
	}

	return 1, "a", &s{}, nil
}

func x() (int, error) {
	return 0, nil
}
