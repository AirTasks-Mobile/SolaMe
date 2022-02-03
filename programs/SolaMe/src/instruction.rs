use std::convert::TryInto;
use solana_program::program_error::ProgramError;

use crate::error::EscrowError::InvalidInstruction;

pub enum EscrowInstruction {
    InitEscrow {
        amount: u64
    },
    Exchange {
        /// the amount the taker expects to be paid in the other token, as a u64 because that's the max possible supply of a token
        amount: u64,
    }
}

impl EscrowInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::InitEscrow {
                amount: Self::unpack_amount(rest)?,
            },
            1 => Self::Exchange {
                amount: Self::unpack_amount(rest)?
            },
            _ => return Err(InvalidInstruction.into()),
        })
    }

    pub fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slide| slide.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;

        Ok(amount)
    }
}
