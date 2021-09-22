package example.b

import input.operation
import input.subject

import data.principals

default allow = false

allow {
	b
	operation == "b"
}

b {
	principal := principals[input.subject.principals[_]][_]
	principal.operations[_] == "b"
}
