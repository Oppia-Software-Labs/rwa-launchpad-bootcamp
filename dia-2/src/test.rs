#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, Symbol,
};

fn sample_asset(env: &Env) -> AssetInfo {
    AssetInfo {
        name: Symbol::new(env, "RWAToken"),
        total_supply: 1_000_000,
        price_per_unit: 100,
        payment_token: Address::generate(env),
        paused: false,
    }
}

fn setup_initialized(env: &Env) -> (Address, RwaLaunchpadClient<'_>) {
    let contract_id = env.register(RwaLaunchpad, ());
    let client = RwaLaunchpadClient::new(env, &contract_id);
    let admin = Address::generate(env);
    let asset = sample_asset(env);

    env.mock_all_auths();
    client.initialize(&admin, &asset);

    (admin, client)
}

#[test]
fn test_mint() {
    let env = Env::default();
    let (admin, client) = setup_initialized(&env);
    let recipient = Address::generate(&env);

    env.mock_all_auths();
    client.mint(&admin, &recipient, &500);

    assert_eq!(client.balance(&recipient), 500);
}

#[test]
fn test_transfer() {
    let env = Env::default();
    let (admin, client) = setup_initialized(&env);
    let from = Address::generate(&env);
    let to = Address::generate(&env);

    env.mock_all_auths();
    client.mint(&admin, &from, &1_000);
    client.transfer(&from, &to, &400);

    assert_eq!(client.balance(&from), 600);
    assert_eq!(client.balance(&to), 400);
}

#[test]
#[should_panic(expected = "Error(Contract, #3)")]
fn test_transfer_insufficient_balance() {
    let env = Env::default();
    let (admin, client) = setup_initialized(&env);
    let from = Address::generate(&env);
    let to = Address::generate(&env);

    env.mock_all_auths();
    client.mint(&admin, &from, &100);
    client.transfer(&from, &to, &200);
}

#[test]
#[should_panic(expected = "HostError: Error(Auth, InvalidAction)")]
fn test_set_whitelist_requires_admin() {
    let env = Env::default();
    let contract_id = env.register(RwaLaunchpad, ());
    let client = RwaLaunchpadClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let attacker = Address::generate(&env);
    let investor = Address::generate(&env);
    let asset = sample_asset(&env);

    env.mock_all_auths();
    client.initialize(&admin, &asset);

    env.mock_auths(&[MockAuth {
        address: &attacker,
        invoke: &MockAuthInvoke {
            contract: &contract_id,
            fn_name: "set_whitelist",
            args: (attacker.clone(), investor.clone(), true).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    client.set_whitelist(&attacker, &investor, &true);
}
