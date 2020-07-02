# This example shows how to decrypt a SIT-encrypted text
# using the Python 3 interface module.
#
# To build the example, run:
#
# > python3 setup.py build
# > python3 setup.py install
# > python3 example_decrypt.py
#
# You should see the following, which is the decrypted text:
# 0xA6 0xBE 0x03 0xFE 0x67 0x52 0x74 0x20

import sit

result = sit.pydecrypt(b'\x55\xBA\xBD\xCC\x41\x0C\x4C\x2F\xE5\x55', b'\x64\x2D\xE4\xC5\x11\x69\x06\xD5')
print(result)
