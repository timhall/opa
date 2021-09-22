package example

import data.example.a as a
import data.example.b as b

default allow = false

allow {
	a.allow
}

allow {
	b.allow
}
