/**
 * Lightweight implementation for SIT: A Lightweight Encryption Algorithm for Secure Internet of Things.
 * 
 * See full article at International Journal of Advanced Computer Science andApplications, Vol. 8, No. 1, 2017.
 */

#include <stdio.h>
#include <stdint.h>

void key_expansion(uint8_t *usr_key, uint16_t *dst_key);

const char P_TABLE[16] = {
	0x03, 0x0F, 0x0E, 0x00,
	0x05, 0x04, 0x0B, 0x0C,
	0x0D, 0x0A, 0x09, 0x06,
	0x07, 0x08, 0x02, 0x01
};

const char Q_TABLE[16] = {
	0x09, 0x0E, 0x05, 0x06,
	0x0A, 0x02, 0x03, 0x0C,
	0x0F, 0x00, 0x04, 0x0D,
	0x07, 0x0B, 0x01, 0x08
};

// Not used for encryption
const char K1_PERM[16] = {
	0x03, 0x02, 0x01, 0x00,
	0x04, 0x05, 0x06, 0x07,
	0x0B, 0x0A, 0x09, 0x08,
	0x0C, 0x0D, 0x0E, 0x0F
};

const char K2_PERM[16] = {
	0x00, 0x04, 0x08, 0x0C,
	0x0D, 0x09, 0x05, 0x01,
	0x02, 0x06, 0x0A, 0x0E,
	0x0F, 0x0B, 0x07, 0x03
};

const char K3_PERM[16] = {
	0x00, 0x01, 0x02, 0x03,
	0x07, 0x06, 0x05, 0x04,
	0x08, 0x09, 0x0A, 0x0B,
	0x0F, 0x0E, 0x0D, 0x0C
};

const char K4_PERM[16] = {
	0x0C, 0x08, 0x04, 0x00,
	0x01, 0x05, 0x09, 0x0D,
	0x0E, 0x0A, 0x06, 0x02,
	0x03, 0x07, 0x0B, 0x0F
};

#define PT_SUBST(db)	P_TABLE[(db & 0xF000) >> 12] << 12	| P_TABLE[(db & 0x0F00) >> 8] << 8	|\
						P_TABLE[(db & 0x00F0) >> 4] << 4	| P_TABLE[db & 0x000F]

#define QT_SUBST(db)	Q_TABLE[(db & 0xF000) >> 12] << 12	| Q_TABLE[(db & 0x0F00) >> 8] << 8	|\
						Q_TABLE[(db & 0x00F0) >> 4] << 4	| Q_TABLE[db & 0x000F]

#define SECOND_FIRST_SWAP(a, b)	do {		\
	uint16_t tmp = a;						\
	a = (a & 0xFF00) | (b & 0xFF00) >> 8;	\
	b = (tmp & 0x00FF) << 8 | (b & 0x00FF);	\
} while(0)

#define	F_FUNCTION(k)	do {		\
	k[0] = PT_SUBST(k[0]);			\
	k[1] = QT_SUBST(k[1]);			\
	k[2] = PT_SUBST(k[2]);			\
	k[3] = QT_SUBST(k[3]);			\
									\
	SECOND_FIRST_SWAP(k[0], k[1]);	\
	SECOND_FIRST_SWAP(k[1], k[2]);	\
	SECOND_FIRST_SWAP(k[2], k[3]);	\
									\
	k[0] = QT_SUBST(k[0]);			\
	k[1] = PT_SUBST(k[1]);			\
	k[2] = QT_SUBST(k[2]);			\
	k[3] = PT_SUBST(k[3]);			\
									\
	SECOND_FIRST_SWAP(k[0], k[1]);	\
	SECOND_FIRST_SWAP(k[1], k[2]);	\
	SECOND_FIRST_SWAP(k[2], k[3]);	\
									\
	k[0] = PT_SUBST(k[0]);			\
	k[1] = QT_SUBST(k[1]);			\
	k[2] = PT_SUBST(k[2]);			\
	k[3] = QT_SUBST(k[3]);			\
} while(0)

#define LR_SHIFT(a, b)	b < 0 ? a >> -b : a << b

#define GEN_SUBST(t, f)	do {									\
	uint16_t tmp = 0;											\
																\
	for(char i = 0; i < 16; i++) {								\
		tmp |= LR_SHIFT((f & (1 << t[i])), ((15 - i) - t[i]));	\
	}															\
																\
	f = tmp;													\
} while(0)

void main(void) {
	uint8_t key[8] = { 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0 };
	uint16_t expanded_key[5];

	key_expansion(key, expanded_key);

	printf("Expanded key: %x %x %x %x %x\n", expanded_key[0], expanded_key[1], expanded_key[2], expanded_key[3], expanded_key[4]);
}

void key_expansion(uint8_t *usr_key, uint16_t *dst_key) {
	uint16_t int_key[4];

	// Initial permutation
	int_key[0] = (usr_key[0] & 0xF0) << 8 | (usr_key[2] & 0xF0) << 4 | (usr_key[4] & 0xF0) | (usr_key[6] & 0xF0) >> 4;
	int_key[1] = (usr_key[0] & 0x0F) << 12 | (usr_key[2] & 0x0F) << 8 | (usr_key[4] & 0x0F) << 4 | (usr_key[6] & 0x0F);
	int_key[2] = (usr_key[1] & 0xF0) << 8 | (usr_key[3] & 0xF0) << 4 | (usr_key[5] & 0xF0) | (usr_key[7] & 0xF0) >> 4;
	int_key[3] = (usr_key[1] & 0x0F) << 12 | (usr_key[3] & 0x0F) << 8 | (usr_key[5] & 0x0F) << 4 | (usr_key[7] & 0x0F);

	F_FUNCTION(int_key);

	// Final matrix substitution
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
