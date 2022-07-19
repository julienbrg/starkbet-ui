import './App.css';
import {useState} from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Button,
  ButtonGroup,
  Stack, HStack, VStack, Box
} from '@chakra-ui/react'
import { Body, Container, Header } from "./components/index.js";
import { connect, getStarknet } from "get-starknet"
import { composeUInt256, parseInputAmountToUint256 } from "./utils.ts";
import BigNumber from "bignumber.js";


function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [bal, setBal] = useState(0)

  const [balance, setBalance] = useState("");

    const readTokenBalance = async (
        token_address = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
    ) => {
        const wallet = getStarknet();
        if (!wallet.isConnected) return undefined;

        const address = wallet.account.address;
        try {
            const result = await wallet.provider.callContract(
                {
                    contractAddress: token_address,
                    entrypoint: "balanceOf",
                    calldata: [BigInt(address).toString()],
                },
                { blockIdentifier: "pending" }
            );
            const balance = composeUInt256(result.result[0], result.result[1]);
            return balance;
        } catch {
            return undefined;
        }
    };

  async function startSession() {
    console.log("start")
    try {
      const wallet = await connect({
        include: ["braavos"],
      });
      if (wallet) {
          await wallet.enable({ showModal: true });
          setIsConnected(!!wallet?.isConnected);
      }
      console.log("isConnected: ", isConnected)
    } catch {}
  }

  async function bet() {
    console.log("bet")
    readTokenBalance().then(balance => setBal(balance ?? "Error"))
    // ... 
  }

  return (
    
    <Container>
      <Header>
        <Button
          
          loadingText='Connecting'
          colorScheme='blue'
          variant='outline'
          onClick={startSession}
        >
          Connect
        </Button>
      </Header>
      <Body>
        <h1>
          Balance: {bal} ETH
        </h1>
        
        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30} onChangeEnd={(val) => console.log(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>

        <Stack direction='row' spacing={4}>

        <Button
          loadingText='Connecting'
          colorScheme='blue'
          variant='outline'
          onClick={bet}
        >
        Bet
        </Button>
      </Stack>
      </Body>
    </Container>
  );
}

export default App;
