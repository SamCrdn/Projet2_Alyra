const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting', accounts => {
    const owner = accounts[0];
    const voterAddr = accounts[1];
    const third = accounts[2];

    let VotingInstance;


    describe("test setter / getter", function() {
       
        before(async function() {
            VotingInstance = await Voting.new({from:owner});     
    
        });
    
        it("should store address voter in mapping", async () => {
            await VotingInstance.addVoter(voterAddr, { from: owner });
            const storedData = await VotingInstance.getVoter(voterAddr);
            expect(storedData.isRegistered).to.equal.true;
        });
        
        it("should store string proposal in array", async () => {
            await VotingInstance.addProposal("proposition 1", { from: voterAddr });
            const storedData = await VotingInstance.getOneProposal(0);
            expect(storedData.description).to.equal("proposition 1");
        });
    
        it("should store votedProposalId in mapping", async () => {
            await VotingInstance.setVote(0, { from: voterAddr });
            const storedData = await VotingInstance.voters(voterAddr);
            expect(storedData.votedProposalId).to.equal(0);
        });

        it("should store hasVoted in mapping", async () => {
            await VotingInstance.setVote(1, { from: voterAddr });
            const storedData = await VotingInstance.voters(voterAddr);
            expect(storedData.hasVoted).to.equal.true;
        });
        
    })

    describe("test event, require, revert", function() {

        before(async function() {
            VotingInstance = await Voting.new({from:owner});
        });

        it("should add proposal, get event proposal Added", async () => {
            const findEvent = await VotingInstance.addProposal("proposition 1",{ from: voterAddr });
            await VotingInstance.Add("proposition 1", { from: voterAddr });
            expectEvent(findEvent,"ProposalRegistered" ,{id: new BN(0)});
        });

        it("should not add a voter if already registrated, revert", async () => {
            await expectRevert(VotingInstance.addVoter(voterAddr, { from: owner }), 'Already registered');
        });
    
    })      
})