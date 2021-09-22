package example.a

import input.operation
import input.subject

import data.principals

default allow = false

allow {
	a
	operation == "a"
}

a {
	principal := principals[input.subject.principals[_]][_]
	principal.operations[_] == "a"
}
