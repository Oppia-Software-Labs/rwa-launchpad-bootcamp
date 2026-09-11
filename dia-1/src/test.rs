#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, Symbol};

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(RwaLaunchpad, ());
    let client = RwaLaunchpadClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let payment_token = Address::generate(&env);
    let asset = AssetInfo {
        name: Symbol::new(&env, "RWAToken"),
        total_supply: 1_000_000,
        price_per_unit: 100,
        payment_token,
        paused: false,
    };

    client.initialize(&admin, &asset);

    let stored_admin: Address = env.as_contract(&contract_id, || {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap()
    });
    let stored_asset: AssetInfo = env.as_contract(&contract_id, || {
        env.storage()
            .instance()
            .get(&DataKey::AssetInfo)
            .unwrap()
    });

    assert_eq!(stored_admin, admin);
    assert_eq!(stored_asset.name, asset.name);
    assert_eq!(stored_asset.total_supply, asset.total_supply);
    assert_eq!(stored_asset.price_per_unit, asset.price_per_unit);
    assert_eq!(stored_asset.payment_token, asset.payment_token);
    assert_eq!(stored_asset.paused, asset.paused);
}
