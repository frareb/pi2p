/**
 * Lightweight implementation for SIT: A Lightweight Encryption Algorithm for Secure Internet of Things.
 * 
 * See full article at International Journal of Advanced Computer Science andApplications, Vol. 8, No. 1, 2017.
 */

#include "sit.h"

void main(void) {
	uint8_t key[8] = { 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0 };
	uint16_t expanded_key[5];

	sit_key_expansion(key, expanded_key);
	printf("Expanded key: %x %x %x %x %x\n", expanded_key[0], expanded_key[1], expanded_key[2], expanded_key[3], expanded_key[4]);

	uint8_t text[8] = { 0xA6, 0xBE, 0x03, 0xFE, 0x67, 0x52, 0x74, 0x20 };
	uint8_t ciphered_text[8];

	printf("Initial text: %x %x %x %x %x %x %x %x\n", text[0], text[1], text[2], text[3], text[4], text[5], text[6], text[7]);
	sit_encrypt(expanded_key, text, ciphered_text);
	printf("Ciphered text: %x %x %x %x %x %x %x %x\n", ciphered_text[0], ciphered_text[1], ciphered_text[2], ciphered_text[3], ciphered_text[4], ciphered_text[5], ciphered_text[6], ciphered_text[7]);

	sit_decrypt(expanded_key, ciphered_text, text);
	printf("Deciphered text: %x %x %x %x %x %x %x %x\n", text[0], text[1], text[2], text[3], text[4], text[5], text[6], text[7]);
}

void sit_key_expansion(uint8_t *usr_key, uint16_t *dst_key) {
	uint16_t int_key[4];

	// Initial permutation
	int_key[0] = (usr_key[0] & 0xF0) << 8 | (usr_key[2] & 0xF0) << 4 | (usr_key[4] & 0xF0) | (usr_key[6] & 0xF0) >> 4;
	int_key[1] = (usr_key[0] & 0x0F) << 12 | (usr_key[2] & 0x0F) << 8 | (usr_key[4] & 0x0F) << 4 | (usr_key[6] & 0x0F);
	int_key[2] = (usr_key[1] & 0xF0) << 8 | (usr_key[3] & 0xF0) << 4 | (usr_key[5] & 0xF0) | (usr_key[7] & 0xF0) >> 4;
	int_key[3] = (usr_key[1] & 0x0F) << 12 | (usr_key[3] & 0x0F) << 8 | (usr_key[5] & 0x0F) << 4 | (usr_key[7] & 0x0F);

	// F-function
	F_FUNCTION(int_key[0]);
	F_FUNCTION(int_key[1]);
	F_FUNCTION(int_key[2]);
	F_FUNCTION(int_key[3]);

	// Final matrix substitution
	// TODO: check order is correct relative to matrices
	GEN_SUBST(K1_PERM, int_key[0]);
	GEN_SUBST(K2_PERM, int_key[1]);
	GEN_SUBST(K3_PERM, int_key[2]);
	GEN_SUBST(K4_PERM, int_key[3]);

	dst_key[0] = int_key[0];
	dst_key[1] = int_key[1];
	dst_key[2] = int_key[2];
	dst_key[3] = int_key[3];
	// Last key generation
	dst_key[4] = int_key[0] ^ int_key[1] ^ int_key[2] ^ int_key[3];
}

void sit_encrypt(uint16_t *expanded_key, uint8_t *raw_content, uint8_t *dst_content) {
	uint16_t content_u16be[4];

	// Init content with user data
	content_u16be[0] = U8_TO_U16BE(raw_content);
	content_u16be[1] = U8_TO_U16BE(raw_content + 2);
	content_u16be[2] = U8_TO_U16BE(raw_content + 4);
	content_u16be[3] = U8_TO_U16BE(raw_content + 6);

	for(char current_key = 0; current_key < 5; current_key++) {
		// Temporary array for data manipulation
		uint16_t tmp_content[4];
		tmp_content[1] = content_u16be[1];

		// First and last double-byte XNOR
		content_u16be[0] = XNOR(expanded_key[current_key], content_u16be[0]);
		content_u16be[3] = XNOR(expanded_key[current_key], content_u16be[3]);

		// Apply F-function after XNOR
		tmp_content[0] = content_u16be[0];
		tmp_content[3] = content_u16be[3];
		F_FUNCTION(tmp_content[0]);
		F_FUNCTION(tmp_content[3]);

		// Middle double-bytes are XORed
		content_u16be[1] = (tmp_content[0] ^ content_u16be[2]);
		content_u16be[2] = (tmp_content[3] ^ tmp_content[1]);

		// Permutation, except on last round
		if(current_key != 4) {
			tmp_content[0] = content_u16be[0];
			content_u16be[0] = content_u16be[1];
			content_u16be[1] = tmp_content[0];

			tmp_content[2] = content_u16be[2];
			content_u16be[2] = content_u16be[3];
			content_u16be[3] = tmp_content[2];
		}
	}

	U16BE_TO_U8(content_u16be[0], dst_content);
	U16BE_TO_U8(content_u16be[1], dst_content + 2);
	U16BE_TO_U8(content_u16be[2], dst_content + 4);
	U16BE_TO_U8(content_u16be[3], dst_content + 6);
}

void sit_decrypt(uint16_t *expanded_key, uint8_t *raw_content, uint8_t *dst_content) {
	uint16_t content_u16be[4];

	// Init content with user data
	content_u16be[0] = U8_TO_U16BE(raw_content);
	content_u16be[1] = U8_TO_U16BE(raw_content + 2);
	content_u16be[2] = U8_TO_U16BE(raw_content + 4);
	content_u16be[3] = U8_TO_U16BE(raw_content + 6);

	for(char current_key = 4; current_key >= 0; current_key--) {
		// Temporary array for data manipulation
		uint16_t tmp_content[4];
		tmp_content[0] = content_u16be[0];
		tmp_content[1] = content_u16be[1];
		tmp_content[2] = content_u16be[2];
		tmp_content[3] = content_u16be[3];

		// First and last double-byte XNOR
		content_u16be[0] = XNOR(expanded_key[current_key], content_u16be[0]);
		content_u16be[3] = XNOR(expanded_key[current_key], content_u16be[3]);

		// Apply F-function before XNOR
		F_FUNCTION(tmp_content[0]);
		F_FUNCTION(tmp_content[3]);

		// Middle double-bytes are XORed
		content_u16be[1] = (tmp_content[3] ^ content_u16be[2]);
		content_u16be[2] = (tmp_content[0] ^ tmp_content[1]);

		// Permutation, except on last round
		if(current_key != 0) {
			tmp_content[0] = content_u16be[0];
			content_u16be[0] = content_u16be[1];
			content_u16be[1] = tmp_content[0];

			tmp_content[2] = content_u16be[2];
			content_u16be[2] = content_u16be[3];
			content_u16be[3] = tmp_content[2];
		}
	}

	U16BE_TO_U8(content_u16be[0], dst_content);
	U16BE_TO_U8(content_u16be[1], dst_content + 2);
	U16BE_TO_U8(content_u16be[2], dst_content + 4);
	U16BE_TO_U8(content_u16be[3], dst_content + 6);
}
