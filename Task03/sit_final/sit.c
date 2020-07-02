/**
 * Lightweight implementation for SIT: A Lightweight Encryption Algorithm for Secure Internet of Things.
 * 
 * See full article at International Journal of Advanced Computer Science andApplications, Vol. 8, No. 1, 2017.
 */

#include "sit.h"

const uint8_t P_TABLE[16] = {
	0x03, 0x0F, 0x0E, 0x00,
	0x05, 0x04, 0x0B, 0x0C,
	0x0D, 0x0A, 0x09, 0x06,
	0x07, 0x08, 0x02, 0x01
};

const uint8_t Q_TABLE[16] = {
	0x09, 0x0E, 0x05, 0x06,
	0x0A, 0x02, 0x03, 0x0C,
	0x0F, 0x00, 0x04, 0x0D,
	0x07, 0x0B, 0x01, 0x08
};

const uint8_t K1_PERM[16] = {
	0x03, 0x02, 0x01, 0x00,
	0x04, 0x05, 0x06, 0x07,
	0x0B, 0x0A, 0x09, 0x08,
	0x0C, 0x0D, 0x0E, 0x0F
};

const uint8_t K2_PERM[16] = {
	0x00, 0x04, 0x08, 0x0C,
	0x0D, 0x09, 0x05, 0x01,
	0x02, 0x06, 0x0A, 0x0E,
	0x0F, 0x0B, 0x07, 0x03
};

const uint8_t K3_PERM[16] = {
	0x00, 0x01, 0x02, 0x03,
	0x07, 0x06, 0x05, 0x04,
	0x08, 0x09, 0x0A, 0x0B,
	0x0F, 0x0E, 0x0D, 0x0C
};

const uint8_t K4_PERM[16] = {
	0x0C, 0x08, 0x04, 0x00,
	0x01, 0x05, 0x09, 0x0D,
	0x0E, 0x0A, 0x06, 0x02,
	0x03, 0x07, 0x0B, 0x0F
};


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

	for(int8_t current_key = 0; current_key < 5; current_key++) {
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

	for(int8_t current_key = 4; current_key >= 0; current_key--) {
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
