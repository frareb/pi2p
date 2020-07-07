/**
 * This example SIT-expand a given key, here "123456789ABCDEF0" (hex.)
 * using the default C API.
 * 
 * To build this example, run:
 * > gcc -o example_key_expand sit.c example_key_expand.c
 * > ./example_key_expand
 * 
 * You should see something like this:
 * 0x55BA 0xBDCC 0x410C 0x4C2F 0xE555
 * which is the expanded version of the key above.
 */

#include <stdio.h>
#include "sit.h"

void main(void) {
	uint8_t key[8] = { 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0 };
	uint16_t expanded_key[5];

	sit_key_expansion(key, expanded_key);
	printf("Expanded key: %x %x %x %x %x\n", expanded_key[0], expanded_key[1], expanded_key[2], expanded_key[3], expanded_key[4]);
}
