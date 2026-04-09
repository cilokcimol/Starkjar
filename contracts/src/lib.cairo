use starknet::ContractAddress;

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer_from(
        ref self: TContractState,
        sender: ContractAddress,
        recipient: ContractAddress,
        amount: u256
    ) -> bool;
    fn allowance(
        self: @TContractState, owner: ContractAddress, spender: ContractAddress
    ) -> u256;
}

#[starknet::interface]
pub trait ITipping<TContractState> {
    fn send_tip(
        ref self: TContractState,
        creator: ContractAddress,
        amount: u256,
        message: ByteArray
    );
    fn get_total_tips(self: @TContractState, creator: ContractAddress) -> u256;
    fn get_tip_count(self: @TContractState, creator: ContractAddress) -> u64;
    fn get_owner(self: @TContractState) -> ContractAddress;
    fn transfer_ownership(ref self: TContractState, new_owner: ContractAddress);
}

#[starknet::contract]
pub mod Tipping {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address, get_contract_address, get_block_timestamp};
    use starknet::storage::{
        Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess
    };

    const STRK_ADDRESS: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

    #[storage]
    struct Storage {
        owner: ContractAddress,
        total_tips: Map<ContractAddress, u256>,
        tip_count: Map<ContractAddress, u64>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        TipSent: TipSent,
        OwnershipTransferred: OwnershipTransferred,
    }

    #[derive(Drop, starknet::Event)]
    pub struct TipSent {
        #[key]
        pub creator: ContractAddress,
        #[key]
        pub donor: ContractAddress,
        pub amount: u256,
        pub message: ByteArray,
        pub timestamp: u64,
    }

    #[derive(Drop, starknet::Event)]
    pub struct OwnershipTransferred {
        pub previous_owner: ContractAddress,
        pub new_owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
    }

    #[abi(embed_v0)]
    impl TippingImpl of super::ITipping<ContractState> {
        fn send_tip(
            ref self: ContractState,
            creator: ContractAddress,
            amount: u256,
            message: ByteArray
        ) {
            assert(amount > 0_u256, 'Amount must be > 0');
            let zero: ContractAddress = 0.try_into().unwrap();
            assert(creator != zero, 'Invalid creator address');

            let donor = get_caller_address();
            let strk = IERC20Dispatcher {
                contract_address: STRK_ADDRESS.try_into().unwrap()
            };

            let allowance = strk.allowance(donor, get_contract_address());
            assert(allowance >= amount, 'Insufficient allowance');

            let success = strk.transfer_from(donor, creator, amount);
            assert(success, 'Transfer failed');

            let prev_total = self.total_tips.entry(creator).read();
            self.total_tips.entry(creator).write(prev_total + amount);

            let prev_count = self.tip_count.entry(creator).read();
            self.tip_count.entry(creator).write(prev_count + 1);

            self.emit(TipSent {
                creator, donor, amount, message, timestamp: get_block_timestamp(),
            });
        }

        fn get_total_tips(self: @ContractState, creator: ContractAddress) -> u256 {
            self.total_tips.entry(creator).read()
        }

        fn get_tip_count(self: @ContractState, creator: ContractAddress) -> u64 {
            self.tip_count.entry(creator).read()
        }

        fn get_owner(self: @ContractState) -> ContractAddress {
            self.owner.read()
        }

        fn transfer_ownership(ref self: ContractState, new_owner: ContractAddress) {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Not owner');
            let previous_owner = self.owner.read();
            self.owner.write(new_owner);
            self.emit(OwnershipTransferred { previous_owner, new_owner });
        }
    }
}
