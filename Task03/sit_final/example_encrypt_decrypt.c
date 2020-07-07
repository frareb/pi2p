/**
 * This example encrypt a text using a given ke0y (here "123456789ABCDEF0" (hex.))
 * and they decrypts it using the default C API.
 * 
 * To build this example, run:
 * > gcc -o example_encrypt_decrypt sit.c example_encrypt_decrypt.c
 * > ./example_encrypt_decrypt
 * 
 * You can then check that the decrypted result matches the initial text.
 */

#include <stdio.h>
#include "sit.h"

void main(void) {
	uint16_t expanded_key[5] = { 0x55BA, 0xBDCC, 0x410C, 0x4C2F, 0xE555 };
	uint8_t text[8] = { 0xA6, 0xBE, 0x03, 0xFE, 0x67, 0x52, 0x74, 0x20 };
	uint8_t ciphered_text[8];

	printf("Initial text: %x %x %x %x %x %x %x %x\n", text[0], text[1], text[2], text[3], text[4], text[5], text[6], text[7]);
	sit_encrypt(expanded_key, text, ciphered_text);
	printf("Ciphered text: %x %x %x %x %x %x %x %x\n", ciphered_text[0], ciphered_text[1], ciphered_text[2], ciphered_text[3], ciphered_text[4], ciphered_text[5], ciphered_text[6], ciphered_text[7]);

	sit_decrypt(expanded_key, ciphered_text, text);
	printf("Deciphered text: %x %x %x %x %x %x %x %x\n", text[0], text[1], text[2], text[3], text[4], text[5], text[6], text[7]);
}
