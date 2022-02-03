// use solana_program::{
//     account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey
// };
//
// use crate::processor::Processor;
//
// //solana_program:::declare_id!("8AJyEC4Gh4tGn21r1Qna3q5bSFryTvGe3ELp41Acnjcu");
//
// entrypoint!(process_instruction);
//
// fn process_instruction(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     instruction_data: &[u8],
// ) -> ProgramResult {
//     Processor::process(program_id, accounts, instruction_data)
// }

// // other example
// use basic_2::*;
//
// #[no_mangle]
// pub unsafe extern "C" fn entrypoint(input: *mut u8) -> u64 {
//     let (program_id, accounts, instruction_data) = unsafe { ::solana_program::entrypoint::deserialize(input) };
//
//     match entry(&program_id, &accounts, &instruction_data){
//         Ok(()) => ::solana_program::entrypoint::SUCCESS,
//         Err(error) -> error.into(),
//     }
// }
//
// #[cfg(not(feature = "no-entrypiont"))]
// pub fn entry(program_id : &Pubkey, accounts: &[AccountInfo], data: &[u8]) -> ProgramResult {
//     if data.len() < 8 {
//         return Err(anchor_lang::__private::ErrorCode::InstructionMissing.into());
//     }
//
//     dispatch(program_id, accounts, data).map_err(|e| {
//         ::solana_program::log::sol_log(&e.to_string);
//         e
//     })
// }
//
// fn dispatch(program_id: &Pubkey, accounts: &[AccountInto], data: &[u8]) -> ProgramResult {
//     let mut ix_data : &[u8] = data;
//     let sighash : [u8; 8] = {
//         let mut sighash : [u8; 8] = [0; 8];
//         sighash.copy_from_slice(&ix_data[..8]);
//         ix_data = &ix_data[8..];
//         sighash
//     };
//
//     if true {
//         if sighash == anchor_lang::idl::IDL_IX_TAG.to_le_bytes(){
//             return __private::__idl::__idl_dispatch(program_id, accounts, &ix_data);
//         }
//     }
//
//     match sighash {
//         [24, 30, 200, 40, 5, 28, 7, 119] => {
//             __private::__global::create(program_id, accounts, ix_data);
//         }
//         [11, 18, 104, 9, 104, 174, 59, 33] => {
//             __private::__global::increase(program_id, accounts, ix_data);
//         }
//         _ => Err(anchor_lang::__private::ErrorCode::InstructionFallbackNotFound.into()),
//     }
// }
//
//
// pub mod __global {
//     use super::*;
//
//     #[inline(never)]
//     pub fn create(program_id: &Pubkey, &[AccountInfo], ix_data: &[u8]) -> ProgramResult {
//         let ix = instruction::Create::deserialize(&mut &ix_data[..])
//         .map_err(|_| anchor_lang::__private::ErrorCode::InstructionDidNotDeserialize)?;
//
//         let instruction::Create { authority } = ix;
//         let mut remaining_accounts: &[AccountInfo] = accounts;
//         let mut accounts = Create::try_accounts(program_id, &mut remaining_accounts, ix_data)?;
//
//         basic_2::create(Context::new(program_id, &mut accounts, remaining_accounts), authority)?;
//         accounts.exit(program_id)
//     }
//
//     #[inline(never)]
//     pub fn increase(program_id: &Pubkey, accounts: &[AccountInfo], ix_data: &[u8]) -> ProgramResult {
//         let ix = instruction::Increment::deserialize(&mut &ix_data[..])
//         .map_err(|_| anchor_lang::__private::ErrorCode::InstructionDidNotDeserialize)?;
//
//         let instruction:Increment = ix;
//         let mut remaining_accounts: &[AccountInfo] = accounts;
//         let mut accounts = Increment::try_accounts(program_id, &mut remaining_accounts, ix_data)?;
//         basic_2::increment(Context::new(program_id, &mut accounts, remaining_accounts))?;
//
//         accounts.exit(program_id)
//     }
// }
// //https://github.com/project-serum/anchor/blob/master/lang/src/context.rs#L8
