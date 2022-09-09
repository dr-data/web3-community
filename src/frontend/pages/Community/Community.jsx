import React, { useEffect, useState } from "react";
import { Container, InnerPageWrapper, Wrapper } from '../../assets/css/common.style';
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { DashboardLeftMenu } from '../../components/Community/LeftMenu';
import { useDispatch, useSelector } from "react-redux";
import { EditCommunity } from '../../components/Community/EditCommunity';
import { useAccount } from 'wagmi';
import { Outlet } from "react-router-dom";
import { Spinner } from 'flowbite-react';
import { useContractRead } from 'wagmi'
import { setCommunityList, setCurrentCommunity } from '../../store/communitySlice';
import { transformCommunity } from '../../utils/transform';
import { mainContract } from '../../utils/requests';

export const Community = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const {
    data: communityList,
    isError,
    isLoading,
    refetch: RefetchCommunityList
  } = useContractRead({
    ...mainContract,
    functionName: 'getUserCommunities',
    args: [address]
  })

  useEffect(() => {
    console.log('isError', isError);
  }, [isError]);


  useEffect(() => {
    console.log('isLoading', isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      loadCommunityList(communityList);
    }
  }, [isLoading])

  const loadCommunityList = (communityList) => {
    setIsReady(false);
    if (communityList.length) {
      // if (setLastByDefault) {
      //   const lastCommunity = communityList[communityList.length - 1];
      //   localStorage.setItem("communityId", lastCommunity.id);
      // }
      let selectedCommunity = parseInt(localStorage.getItem("communityId"));
      if (!selectedCommunity) {
        selectedCommunity = parseInt(communityList[0].id);
      }

      const transformedCommunity = communityList.map(item => {
        const community = transformCommunity(item);
        if (community.id === selectedCommunity) {
          // select active community
          dispatch(setCurrentCommunity({ community }));
        }
        return community;
      });
      dispatch(setCommunityList({ list: transformedCommunity }));
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }

  const reloadCommunityList = () => {
    RefetchCommunityList().then(result => {
      console.log('result', result);
      loadCommunityList(result.data);
    });
  }

  return (
    <InnerPageWrapper>
      <Header isInner={true} reloadCommunityList={reloadCommunityList} />
      <div id="home" className="relative h-[80px] bg-primary mb-6" />

      {isReady ? (
        <Wrapper>
          {communityList.length > 0 ? (
            <Container className="flex flex-row">
              <div className="w-56">
                <DashboardLeftMenu />
              </div>
              <div className="flex-auto ml-12">
                <Outlet context={[reloadCommunityList]} />
              </div>
            </Container>
          ) : (
            <Container>
              <div className="text-center bg-white py-6 px-12 rounded-lg shadow w-1/2 mx-auto mt-6">
                <h2 className="text-2xl font-semibold text-gray-700">New Community</h2>
                <p className="text-sm">Look like you don't have Community, let's create first one:</p>

                <div className="my-6">
                  <EditCommunity handleSuccess={() => reloadCommunityList()} />
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
