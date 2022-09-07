import React, { useEffect, useState } from "react";
import { Container, InnerPageWrapper, Wrapper } from '../../assets/css/common.style';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { DashboardLeftMenu } from '../../components/Dashboard/LeftMenu';
import { useDispatch, useSelector } from "react-redux";
import { CreateCommunity } from '../../components/Dashboard/CreateCommunity';
import { useAccount } from 'wagmi';
import { setCommunityList, setCurrentCommunity } from '../../store/communitySlice';
import { Outlet } from "react-router-dom";
import { Spinner } from 'flowbite-react';
import { transformCommunity } from '../../utils/transform';

export const Community = ({ contract }) => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const communityList = useSelector(state => state.community.list);
  const currentCommunity = useSelector(state => state.community.current);

  const loadCommunityList = async () => {
    const myCommunity = await contract.getUserCommunities(address);
    if (myCommunity.length) {
      dispatch(setCommunityList({
        list: myCommunity.map(item => transformCommunity(item))
      }));
      dispatch(setCurrentCommunity({
        id: parseInt(myCommunity[0].id)
      }));
    }
  }

  useEffect(() => {
    setIsReady(true);
  }, [communityList]);

  useEffect(() => {
    if (contract) {
      loadCommunityList();
    }
  }, [contract]);

  return (
    <InnerPageWrapper>
      <Header isInner={true} />
      <div id="home" className="relative h-[80px] bg-primary mb-6" />

      {isReady ? (
        <Wrapper>
          {currentCommunity !== null ? (
            <Container className="flex flex-row">
              <div className="w-56">
                <DashboardLeftMenu />
              </div>
              <div className="flex-auto ml-12">
                <Outlet />
              </div>
            </Container>
          ) : (
            <Container>
              <div className="text-center bg-white py-6 px-12 rounded-lg shadow w-1/2 mx-auto mt-6">
                <h2 className="text-2xl font-semibold text-gray-700">New Community</h2>
                <p className="text-sm">Look like you don't have Community, let's create first one:</p>

                <div className="my-6">
                  <CreateCommunity contract={contract} />
                </div>

                <hr className="my-4" />
                <p className="text-sm opacity-50">Already have community on this address? Try to switch
                  <a href="https://dappradar.com/blog/guide-on-how-to-switch-network-in-metamask"
                     target="_blank"
                     className="underline ml-1">
                    wallet network
                  </a>.
                </p>
              </div>
            </Container>
          )}
        </Wrapper>
      ) : (
        <div className="w-10 mx-auto">
          <Spinner size="xl" />
        </div>
      )}

      <Footer />
    </InnerPageWrapper>
  );
}
