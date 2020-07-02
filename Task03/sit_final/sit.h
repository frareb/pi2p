#pragma once

#include <stdint.h>

#define U8_TO_U16BE(p)	(*(p) << 8) | (*(p+1))
#define U16BE_TO_U8(v, p)	do {	\
	*(p+1) = v & 0x00FF;				\
	*(p) = (v & 0xFF00) >> 8;		\
} while(0)

#define PQPQ_SUBST(db)	P_TABLE[(db & 0xF000) >> 12] << 12	| Q_TABLE[(db & 0x0F00) >> 8] << 8	|\
						P_TABLE[(db & 0x00F0) >> 4] << 4	| Q_TABLE[db & 0x000F]

#define QPQP_SUBST(db)	Q_TABLE[(db & 0xF000) >> 12] << 12	| P_TABLE[(db & 0x0F00) >> 8] << 8	|\
						Q_TABLE[(db & 0x00F0) >> 4] << 4	| P_TABLE[db & 0x000F]

#define F_SWAP(db)	(db & 0xC000)		| (db & 0x3000) >> 2 | (db & 0x0C00) << 2 | (db & 0x0300) >> 2 |\
					(db & 0x00C0) << 2	| (db & 0x0030) >> 2 | (db & 0x000C) << 2 | (db & 0x0003)

#define F_FUNCTION(db)	do {	\
	db = PQPQ_SUBST(db);		\
	db = F_SWAP(db);			\
	db = QPQP_SUBST(db);		\
	db = F_SWAP(db);			\
	db = PQPQ_SUBST(db);		\
} while(0)

#define LR_SHIFT(a, b)	b < 0 ? a >> -b : a << b

#define XNOR(a, b)	~(a ^ b)

#define GEN_SUBST(t, f)	do {									\
	uint16_t tmp = 0;											\
																\
	for(uint8_t i = 0; i < 16; i++) {								\
		tmp |= LR_SHIFT((f & (1 << t[i])), ((15 - i) - t[i]));	\
	}															\
																\
	f = tmp;													\
} while(0)

void sit_key_expansion(uint8_t *usr_key, uint16_t *dst_key);
void sit_encrypt(uint16_t *expanded_key, uint8_t *raw_content, uint8_t *dst_content);
void sit_decrypt(uint16_t *expanded_key, uint8_t *raw_content, uint8_t *dst_content);
