import './App.css';
import {useState} from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Stack, 
  useToast, 
  Wrap, 
  WrapItem
} from '@chakra-ui/react'
import { Body, Container, Header, Box, Info } from "./components/index.js";
import { connect, getStarknet } from "get-starknet"
import { composeUInt256 } from "./utils.ts";
import { utils } from "ethers";

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [bal, setBal] = useState(0)
  const [rollUnder, setRollUnder] = useState(50)
  const [winChance, setWinChance] = useState(50)
  const [payout, setPayout] = useState(1.9)

  function ToastStatusExample() {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
  
    return (
      <Wrap>
        {statuses.map((status, i) => (
          <WrapItem key={i}>
            <Button
              onClick={() =>
                toast({
                  title: `${status} toast`,
                  status: status,
                  isClosable: true,
                })
              }
            >
              Show {status} toast
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    )
  }

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
          readTokenBalance().then(balance => setBal(balance ?? "Error"))
      }
      console.log("isConnected: ", isConnected)
    } catch {}
  }

  async function update(val) {

    setRollUnder(val)
    setWinChance(val)
    setPayout(0.001 * 100 / val) // BETAMOUNT * MAX_CAP / SLIDER_BET
  }

  async function bet() {
    console.log("bet")
    ToastStatusExample()
    
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
          Balance: {utils.formatEther(bal)} ETH
        </h1>
        <br />
        <Info>
        <Box>
          <h1>Roll under</h1>
          <p>{rollUnder}</p>
        </Box>
        <Box>
          <p>Win chance</p>
          <p>{winChance}%</p>
        </Box>
        <Box>
          <p>Payout</p>
          <p>{payout}</p>
        </Box>
        </Info>
        <br />
        <Slider aria-label='slider-ex-2' colorScheme='pink' defaultValue={30} onChangeEnd={(val) => update(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <br />

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
