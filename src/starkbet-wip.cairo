# Declare this file as a StarkNet contract.
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.math import assert_nn, assert_le
from starkware.cairo.common.uint256 import (
    Uint256,
    uint256_check,
    uint256_add,
    uint256_sub,
    uint256_mul,
    uint256_unsigned_div_rem,
    uint256_le,
    uint256_lt,
    uint256_eq,
)
from starkware.starknet.common.syscalls import get_block_number

# Define a storage variable.
@storage_var
func owner() -> (res : felt):
end

# balance sent inside the contract by user
@storage_var
func balanceEth() -> (res : felt):
end

# Balance due by user after betting
@storage_var
func balancePayout(userAddress : felt) -> (res : felt):
end

# House fees collected
@storage_var
func houseFeesCollected() -> (res : felt):
end

struct Bet:
    member address : felt
    member block : felt
    member cap : felt
    member amount : felt
end

# mapping bet id (number), and bet
@storage_var
func bets(betId : felt) -> (res : Bet):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    owner_address : felt
):
    owner.write(value=owner_address)
    return ()
end

@storage_var
func counter() -> (res : felt):
end

const FEE_NUMERATOR = 1
const FEE_DENOMINATOR = 100
const MAXIMUM_CAP = 100000
const MAXIMUM_BET_SIZE = 10

# # setters
# Increases the balance by the given amount.
@external
func placeBet{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    cap : felt, amount : felt, address : felt
):
    # user need to approve ETH token first

    # function transferFrom token de base ETH

    # register inside ethBalance

    #

    # require(cap <= MAXIMUM_CAP);
    assert_le(amount, MAXIMUM_CAP)
    # require(msg.value <= MAXIMUM_BET_SIZE);
    assert_le(amount, MAXIMUM_BET_SIZE)

    let (res) = counter.read()
    counter.write(res + 1)

    let (block_number) = get_block_number()
    let futurBetBlock = block_number + 3

    # save bet data in a mapping ?
    let (count) = counter.read()
    let myBet = Bet(address=address, block=futurBetBlock, cap=cap, amount=amount)
    bets.write(count, myBet)
    return ()
end

# # setters
# Role the dice with your parameters.
@external
func rollDice{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(betId : felt):
    # calculate if its good or not

    return ()
end

# Getters

# # verify if bet is winning

@view
func get_counter{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
    res : felt
):
    let (res) = counter.read()
    return (res)
end

@view
func checkResult{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
    betId : felt
) -> (res : felt):
    # # checking data
    let (res) = counter.read()  # temp
    # getting blockNumber from the bet struct

    # access data from mappings
    # let mybet = bets(betId)

    # oracle solution: modulo of hash of one of price feed

    # non oracle solution: modulo of blockhash

    return (res)
end
