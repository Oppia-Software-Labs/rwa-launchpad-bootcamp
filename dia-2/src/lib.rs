#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, symbol_short, Address,
    Env, Symbol,
};

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

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    InsufficientBalance = 3,
    InvalidAmount = 4,
    NotWhitelisted = 5,
    Paused = 6,
}

#[contract]
pub struct RwaLaunchpad;

impl RwaLaunchpad {
    fn require_initialized(env: &Env) {
        if !env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, Error::NotInitialized);
        }
    }

    fn require_not_paused(env: &Env) {
        let asset: AssetInfo = env
            .storage()
            .instance()
            .get(&DataKey::AssetInfo)
            .unwrap();
        if asset.paused {
            panic_with_error!(env, Error::Paused);
        }
    }

    fn read_balance(env: &Env, id: &Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(id.clone()))
            .unwrap_or(0)
    }

    fn write_balance(env: &Env, id: &Address, amount: i128) {
        env.storage()
            .persistent()
            .set(&DataKey::Balance(id.clone()), &amount);
    }

    // Each team implements this according to their chosen variación.
    fn check_variation_gate(env: &Env, investor: &Address) -> Result<(), Error> {
        let _ = (env, investor);
        todo!("cada equipo define su regla de acceso aquí")
    }
}

#[contractimpl]
impl RwaLaunchpad {
    pub fn initialize(env: Env, admin: Address, asset: AssetInfo) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, Error::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::AssetInfo, &asset);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        Self::require_initialized(&env);
        Self::read_balance(&env, &id)
    }

    pub fn mint(env: Env, admin: Address, to: Address, amount: i128) {
        Self::require_initialized(&env);
        admin.require_auth();
        Self::require_not_paused(&env);
        if amount <= 0 {
            panic_with_error!(&env, Error::InvalidAmount);
        }

        let current = Self::read_balance(&env, &to);
        Self::write_balance(&env, &to, current + amount);
        env.events()
            .publish((symbol_short!("mint"),), (to, amount));
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        Self::require_initialized(&env);
        from.require_auth();
        Self::require_not_paused(&env);
        if amount <= 0 {
            panic_with_error!(&env, Error::InvalidAmount);
        }

        let from_balance = Self::read_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(&env, Error::InsufficientBalance);
        }

        Self::write_balance(&env, &from, from_balance - amount);
        let to_balance = Self::read_balance(&env, &to);
        Self::write_balance(&env, &to, to_balance + amount);
        env.events()
            .publish((symbol_short!("transfer"),), (from, to, amount));
    }

    // INSTRUCTOR NOTE: Intentionally missing admin.require_auth() for the Day 2 bug-finding
    // exercise. Any address can whitelist any investor. Students should discover this via
    // test_set_whitelist_requires_admin and add the missing auth check.
    pub fn set_whitelist(env: Env, _admin: Address, investor: Address, approved: bool) {
        Self::require_initialized(&env);
        env.storage()
            .persistent()
            .set(&DataKey::Whitelisted(investor), &approved);
    }
}

#[cfg(test)]
mod test;
