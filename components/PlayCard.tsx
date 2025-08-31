
import React, { useState } from 'react';
import type { PlayAnalysis, TechnicalTerm, Breakdown, ExecutionDetails } from '../types';
import { ChevronDownIcon, ExternalLinkIcon } from './Icons';

interface PlayCardProps {
  play: PlayAnalysis;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4 border-b border-gray-700 last:border-b-0">
    <h3 className="text-lg font-semibold text-cyan-300 mb-2">{title}</h3>
    <div className="space-y-2 text-gray-300">{children}</div>
  </div>
);

const BreakdownSection: React.FC<{ title: string; breakdown: Breakdown }> = ({ title, breakdown }) => {
    const details = breakdown.executionDetails;
    return (
        <Section title={title}>
            <p><span className="font-semibold text-gray-200">Play Call:</span> {breakdown.inferredPlayCall}</p>
            <div className="pl-4 border-l-2 border-cyan-700 mt-2 space-y-1">
                { (details.QB) && <p><span className="font-bold">QB:</span> {details.QB}</p> }
                { (details['O-Line'] || details.OLine) && <p><span className="font-bold">O-Line:</span> {details['O-Line'] || details.OLine}</p> }
                { (details['Receivers/TEs'] || details.ReceiversTEs) && <p><span className="font-bold">Receivers/TEs:</span> {details['Receivers/TEs'] || details.ReceiversTEs}</p> }
                { (details.RunningBack) && <p><span className="font-bold">RB:</span> {details.RunningBack}</p> }
                { (details['D-Line'] || details.DLine) && <p><span className="font-bold">D-Line:</span> {details['D-Line'] || details.DLine}</p> }
                { (details.Linebackers) && <p><span className="font-bold">LBs:</span> {details.Linebackers}</p> }
                { (details.Secondary) && <p><span className="font-bold">Secondary:</span> {details.Secondary}</p> }
            </div>
        </Section>
    )
};

const AccordionItem: React.FC<{ term: TechnicalTerm }> = ({ term }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-600">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-3 px-4 bg-gray-700/50 hover:bg-gray-700 transition-colors"
      >
        <span className="font-semibold">{term.term}</span>
        <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
        <div className="p-4 bg-gray-800 text-gray-400">
          {term.definition}
        </div>
      </div>
    </div>
  );
};


const PlayCard: React.FC<PlayCardProps> = ({ play }) => {
  return (
    <div className="bg-slate-800 shadow-2xl shadow-black/30 rounded-lg overflow-hidden border border-gray-700 mx-2">
      <div className="p-6 bg-gradient-to-r from-slate-800 to-gray-800">
        <h2 className="text-2xl font-bold text-white mb-1">Play {play.playNumber}: {play.title}</h2>
        <a
          href={play.timestampedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
        >
          Watch on YouTube <ExternalLinkIcon />
        </a>
      </div>

      <div className="px-6 pb-6">
        <Section title="Situation">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <p><span className="font-semibold text-gray-200">Score:</span> {play.situation.currentScore}</p>
            <p><span className="font-semibold text-gray-200">Down & Dist:</span> {play.situation.downAndDistance}</p>
            <p><span className="font-semibold text-gray-200">Field Position:</span> {play.situation.fieldPosition}</p>
            <p><span className="font-semibold text-gray-200">Time:</span> {play.situation.quarterAndTime}</p>
          </div>
        </Section>

        <Section title="Pre-Snap Analysis">
          <p><span className="font-semibold text-gray-200">Offense:</span> {play.preSnapAnalysis.offensiveFormation}</p>
          <p><span className="font-semibold text-gray-200">Defense:</span> {play.preSnapAnalysis.defensiveFormation}</p>
        </Section>

        <BreakdownSection title="Offensive Breakdown" breakdown={play.offensiveBreakdown} />
        <BreakdownSection title="Defensive Breakdown" breakdown={play.defensiveBreakdown} />
        
        <Section title="Key to Success / Failure">
            <p className="italic">"{play.keyToSuccessOrFailure}"</p>
        </Section>

        <Section title="Outcome">
            <p className="font-bold text-xl text-white">{play.outcome}</p>
        </Section>
        
        <div className="pt-4">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Technical Terms Explained</h3>
            <div className="rounded-md overflow-hidden border border-gray-600">
                {play.technicalTerms.map((term, index) => <AccordionItem key={index} term={term} />)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlayCard;
