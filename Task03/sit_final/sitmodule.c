#define PY_SSIZE_T_CLEAN
#include <Python.h>
#include "sit.h"

static PyObject *sit_pydecrypt(PyObject *self, PyObject *args) {
	const uint8_t *key_u8;
	const uint8_t *ciphered_text;
	const uint8_t text[8];
	Py_ssize_t length;

	if(!PyArg_ParseTuple(args, "y#y#", &key_u8, &length, &ciphered_text, &length))
		return NULL;

	uint16_t key_u16[5];

	for(char i = 0; i < 5; i++) {
		key_u16[i] = U8_TO_U16BE(key_u8 + 2 * i);
	}

	sit_decrypt(key_u16, ciphered_text, text);
	return Py_BuildValue("y#", &text, 8);
}

static PyMethodDef SitMethods[] = {
	{"pydecrypt", sit_pydecrypt, METH_VARARGS, "Execute a shell command."},
	{NULL, NULL, 0, NULL}        /* Sentinel */
};

static struct PyModuleDef sitmodule = {
	PyModuleDef_HEAD_INIT,
	"sit",
	NULL,
	-1,
	SitMethods
};

PyMODINIT_FUNC PyInit_sit(void) {
	return PyModule_Create(&sitmodule);
}
