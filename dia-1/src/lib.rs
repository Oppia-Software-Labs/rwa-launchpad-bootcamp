#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[contracttype]
pub enum DataKey {
    Admin,
    AssetInfo,
    Balance(Address),
    Whitelisted(Address),
}

#[contracttype]
pub struct AssetInfo {
    pub name: Symbol,
    pub total_supply: i128,
    pub price_per_unit: i128,
    pub payment_token: Address,
    pub paused: bool,
}

#[contract]
pub struct RwaLaunchpad;

#[contractimpl]
impl RwaLaunchpad {
    pub fn initialize(env: Env, admin: Address, asset: AssetInfo) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::AssetInfo, &asset);
    }

    pub fn balance(_env: Env, _id: Address) -> i128 {
        todo!()
    }

    pub fn mint(_env: Env, _admin: Address, _to: Address, _amount: i128) {
        todo!()
    }

    pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {
        todo!()
    }

    pub fn set_whitelist(_env: Env, _admin: Address, _investor: Address, _approved: bool) {
        todo!()
    }
}

#[cfg(test)]
mod test;
