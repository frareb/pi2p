from distutils.core import setup, Extension

sitmodule = Extension('sit', sources = ['sit.c', 'sitmodule.c'])

setup(	name = 'SIT',
		version = '1.0',
		description = 'SIT lightweight encryption module',
		ext_modules = [sitmodule])
