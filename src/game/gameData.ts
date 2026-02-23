import { Encounter } from './types';

export const ENCOUNTERS: Record<string, Encounter> = {
  strange_traveler: {
    id: 'strange_traveler',
    title: 'A Lonely Wanderer',
    description: 'A cloaked figure stands by the dusty fork. They look parched and weary.',
    icon: '👤',
    choices: [
      { id: 'help_wanderer', text: 'Give them food (10 Food)', consequenceText: 'The wanderer thanks you deeply. "May the blocks be with you."', foodCost: 10, reputationGain: 2, flagToSet: 'helped_wanderer', color: 'bg-emerald-600' },
      { id: 'scholar_advice', text: "Scholar's Counsel", consequenceText: 'Your Scholar recognizes the traveler as a disgraced noble. You gain massive renown.', requiredPassengerType: 'scholar', foodCost: 5, reputationGain: 15, color: 'bg-indigo-600' },
      { id: 'ignore_wanderer', text: 'Keep driving.', consequenceText: 'You save your rations but feel a chill in the air.', color: 'bg-stone-600' }
    ]
  },
  food_provisioner: {
    id: 'food_provisioner', title: 'Traveling Provisioner',
    description: 'A wagon laden with salted meats and dried grain pulls alongside yours.',
    icon: '🧺',
    choices: [
      { id: 'buy_food_bulk', text: 'Buy Bulk Supplies (30 Gold for 50 Food)', consequenceText: '"A wise investment."', goldCost: 30, foodGain: 50, color: 'bg-blue-600' },
      { id: 'sell_surplus', text: 'Sell Surplus (25 Food for 35 Gold)', consequenceText: '"Here is your coin."', foodCost: 25, goldGain: 35, color: 'bg-amber-600' },
      { id: 'rob_cart', text: 'Rob the Cart!', consequenceText: 'You overpower the merchant. Word of your cruelty spreads.', foodGain: 80, reputationCost: 40, flagToSet: 'bandit_notoriety', color: 'bg-red-900' }
    ]
  },
  traveling_artisan: {
    id: 'traveling_artisan', title: 'The Master Artisan',
    description: 'A wagon covered in blueprints waits at the fork. "I can make your caravan the pride of the Westfold."',
    icon: '⚒️',
    choices: [
      { id: 'upgrade_speed', text: 'Aerodynamic Panels (120 Gold)', consequenceText: '"Your wagon will slice through the wind!"', goldCost: 120, flagToSet: 'speed_upgrade', color: 'bg-cyan-600' },
      { id: 'upgrade_capacity', text: 'Extended Sleeping Quarters (150 Gold)', consequenceText: '"More room for more stories."', goldCost: 150, flagToSet: 'capacity_upgrade', color: 'bg-amber-600' },
      { id: 'upgrade_efficiency', text: 'Vacuum-Sealed Pantries (100 Gold)', consequenceText: '"Not a crumb will go to waste."', goldCost: 100, flagToSet: 'efficiency_upgrade', color: 'bg-emerald-700' }
    ]
  },
  technomancer: {
    id: 'technomancer', title: 'The Technomancer',
    description: 'A dealer in chrome and sparks. "Upgrade your soul with the latest block-tech."',
    icon: '⚡',
    choices: [
      { id: 'overclock', text: 'Overclock Engine (100 Gold)', consequenceText: '"Maximum output achieved!"', goldCost: 100, flagToSet: 'speed_upgrade', color: 'bg-purple-600' },
      { id: 'life_support', text: 'Nano-Repairs (80 Gold)', consequenceText: 'Tiny bots patch holes and reinforce the hull.', goldCost: 80, reputationGain: 5, color: 'bg-cyan-500' }
    ]
  },
  soul_stitcher: {
    id: 'soul_stitcher', title: 'The Soul-Stitcher',
    description: 'An entity draped in ethereal threads. "Shall I lighten your load or mend your spirit?"',
    icon: '🧶',
    choices: [
      { id: 'mend_spirit', text: 'Mend Spirit (30 Renown)', consequenceText: 'Your renown fades as your vitality returns.', reputationCost: 30, color: 'bg-indigo-700' },
      { id: 'sacrifice_gold', text: 'Blessing of Gold (50 Gold)', consequenceText: 'The spirits accept your offering.', goldCost: 50, reputationGain: 20, color: 'bg-yellow-600' }
    ]
  },
  provision_master: {
    id: 'provision_master', title: 'The Provision Master',
    description: 'A giant in a chef\'s hat. "Only the finest chunks for the finest drivers."',
    icon: '🍳',
    choices: [
      { id: 'royal_feast', text: 'Royal Feast (60 Gold)', consequenceText: 'A massive spread of rare delicacies!', goldCost: 60, foodGain: 100, reputationGain: 15, color: 'bg-pink-600' },
      { id: 'mercy_rations', text: 'Renown Exchange (15 Renown)', consequenceText: 'The Master feeds you out of professional respect.', reputationCost: 15, foodGain: 40, color: 'bg-amber-700' }
    ]
  },
  desert_mirage: {
    id: 'desert_mirage', title: 'The Desert Mirage',
    description: 'The air shimmers, revealing a shimmering oasis that shouldn\'t be there.',
    icon: '✨',
    choices: [
      { id: 'investigate_mirage', text: 'Investigate (50/50 Chance)', consequenceText: 'It was real! You find a cache of ancient supplies.', foodGain: 40, goldGain: 20, color: 'bg-cyan-600' },
      { id: 'scholar_truth', text: "Scholar's Insight", consequenceText: 'Your Scholar realizes it is a localized temporal rift!', requiredPassengerType: 'scholar', reputationGain: 25, color: 'bg-indigo-700' }
    ]
  },
  knights_vigil: {
    id: 'knights_vigil', title: "Old Knight's Vigil",
    description: 'An aging warrior in rusted plate armor sits by a small campfire.',
    icon: '🛡️',
    choices: [
      { id: 'guard_sparring', text: 'Guard Sparring', consequenceText: 'The old warrior is impressed and grants you his blessing.', requiredPassengerType: 'guard', reputationGain: 15, flagToSet: 'knight_blessing', color: 'bg-slate-700' },
      { id: 'offer_meal', text: 'Share a Feast (25 Food)', consequenceText: 'The Knight tells you tales of the Haven.', foodCost: 25, reputationGain: 20, goldGain: 50, color: 'bg-orange-700' }
    ]
  },
  wandering_library: {
    id: 'wandering_library', title: 'Wandering Library',
    description: 'A massive wagon overflowing with scrolls and books.',
    icon: '📚',
    choices: [
      { id: 'buy_maps', text: 'Buy Secret Maps (40 Gold)', consequenceText: 'The maps reveal gold-rich routes.', goldCost: 40, flagToSet: 'secret_maps', color: 'bg-blue-600' },
      { id: 'donate_scrolls', text: 'Donate 10 Renown', consequenceText: 'The Librarian writes a book about you!', reputationCost: 10, reputationGain: 40, color: 'bg-indigo-600' }
    ]
  },
  blocky_banker: {
    id: 'blocky_banker', title: 'The Blocky Banker',
    description: 'A finely dressed figure sits behind a desk in a mobile office.',
    icon: '💼',
    choices: [
      { id: 'reputation_loan', text: 'Trade 10 Renown for 100 Gold', consequenceText: '"Fame is fleeting, but gold is forever!"', reputationCost: 10, goldGain: 100, color: 'bg-yellow-700' },
      { id: 'invest_gold', text: 'Invest 50 Gold for Renown', consequenceText: 'You sponsor a local festival.', goldCost: 50, reputationGain: 25, color: 'bg-blue-700' }
    ]
  },
  cursed_relic: {
    id: 'cursed_relic', title: 'The Cursed Relic',
    description: 'An ancient, glowing chest sits abandoned.',
    icon: '💀',
    choices: [
      { id: 'open_relic', text: 'Open the Chest (Gain 250 Gold)', consequenceText: 'The chest is overflowing! But a dark cloud follows...', goldGain: 250, reputationCost: 30, flagToSet: 'cursed_caravan', color: 'bg-red-950' },
      { id: 'leave_relic', text: 'Walk away.', consequenceText: 'Some treasures are better left buried.', reputationGain: 5, color: 'bg-stone-600' }
    ]
  },
  ancient_golem: {
    id: 'ancient_golem', title: 'The Ancient Golem',
    description: 'A moss-covered stone giant blocks the road.',
    icon: '🗿',
    choices: [
      { id: 'repair_golem', text: 'Offer Gold Core (100 Gold)', consequenceText: 'The Golem awakens and repairs your caravan!', goldCost: 100, foodGain: 50, reputationGain: 20, flagToSet: 'golem_blessing', color: 'bg-cyan-700' },
      { id: 'scholar_golem', text: 'Ancient Deciphering', consequenceText: 'Your Scholar reads the runes. The Golem grants you 1 extra life!', requiredPassengerType: 'scholar', reputationGain: 10, color: 'bg-indigo-600' }
    ]
  },
  shady_dealer: {
    id: 'shady_dealer', title: 'The Shady Dealer',
    description: 'A grease-stained man whispers from the shadows.',
    icon: '🌚',
    choices: [
      { id: 'sell_crew', text: 'Sell a Crew Member (200 Gold)', consequenceText: 'You trade a companion for a heavy purse.', goldGain: 200, reputationCost: 50, action: 'remove_passenger', color: 'bg-red-900' },
      { id: 'refuse_dealer', text: 'Refuse the deal.', consequenceText: '"Suit yourself."', reputationGain: 1, color: 'bg-stone-600' }
    ]
  },
  traveling_herbalist: {
    id: 'traveling_herbalist', title: 'The Herbalist',
    description: 'Vibrant flowers grow directly out of the roof of this colorful wagon.',
    icon: '🌿',
    choices: [
      { id: 'buy_elixir', text: 'Buy Vitality Elixir (30 Gold)', consequenceText: 'The bitter brew restores your provisions.', goldCost: 30, foodGain: 100, reputationGain: 5, color: 'bg-emerald-500' },
      { id: 'cook_collaboration', text: "Cook's Recipe Exchange", consequenceText: 'Your Cook impresses the Herbalist with a secret spice!', requiredPassengerType: 'cook', foodGain: 40, reputationGain: 10, color: 'bg-pink-600' }
    ]
  },
  diplomatic_envoy: {
    id: 'diplomatic_envoy', title: 'Diplomatic Envoy',
    description: 'A carriage of gold and silk blocks the path.',
    icon: '📜',
    choices: [
      { id: 'trade_renown', text: 'Trade 20 Renown for 150 Gold', consequenceText: 'You spend your social capital to fill your coffers.', reputationCost: 20, goldGain: 150, color: 'bg-blue-600' },
      { id: 'honor_envoy', text: 'Provide Guard Escort', consequenceText: 'Your Guard ensures safe passage.', requiredPassengerType: 'guard', goldGain: 80, reputationGain: 10, color: 'bg-emerald-700' }
    ]
  },
  hungry_merchant: {
    id: 'hungry_merchant', title: 'Stranded Merchant',
    description: 'A broken wagon sits by the road. The merchant is desperate.',
    icon: '🛒',
    choices: [
      { id: 'merchant_negotiation', text: "Merchant's Haggle", consequenceText: 'Your on-board Merchant spots rare spices!', requiredPassengerType: 'merchant', goldCost: 20, goldGain: 80, color: 'bg-yellow-700' },
      { id: 'trade_supplies', text: 'Sell 15 Food for 45 Gold', consequenceText: '"You saved my livelihood!"', foodCost: 15, goldGain: 45, color: 'bg-amber-600' },
      { id: 'buy_stock', text: 'Buy Bulk Food (30 Gold for 40 Food)', consequenceText: 'He sells you his remaining stock at a discount.', goldCost: 30, foodGain: 40, color: 'bg-blue-600' }
    ]
  },
  bandit_toll: {
    id: 'bandit_toll', title: 'The Shadowed Gate',
    description: 'Armed blocky riders block the path. "Toll road," their leader sneers.',
    icon: '⚔️',
    choices: [
      { id: 'guard_standoff', text: "Guard's Threat", consequenceText: 'Your Guard steps forward. The bandits back down.', requiredPassengerType: 'guard', reputationGain: 5, color: 'bg-slate-800' },
      { id: 'pay_toll', text: 'Pay the toll (25 Gold)', consequenceText: 'They let you pass with mock salutes.', goldCost: 25, color: 'bg-red-700' }
    ]
  },
  food_cart: {
    id: 'food_cart', title: "Chef Block's Mobile Grill",
    description: 'The aroma of grilled mystery meat is intoxicating.',
    icon: '🍳',
    choices: [
      { id: 'snack', text: 'Light Snack (8G -> 15 Food)', consequenceText: 'A tasty, quick bite.', goldCost: 8, foodGain: 15, color: 'bg-green-500' },
      { id: 'platter', text: 'Gourmet Feast (30G -> 65 Food)', consequenceText: 'A massive spread!', goldCost: 30, foodGain: 65, color: 'bg-green-700' }
    ]
  },
  waystation: {
    id: 'waystation', title: 'Border Waystation',
    description: 'A major fortified supply point in the middle of nowhere.',
    icon: '🚩',
    choices: [
      { id: 'resupply', text: 'Full Resupply (40 Gold)', consequenceText: 'You top off all provisions.', goldCost: 40, foodGain: 100, color: 'bg-cyan-600' },
      { id: 'help_guards', text: 'Donate Supplies (25 Food)', consequenceText: 'The guards are thankful.', foodCost: 25, reputationGain: 12, color: 'bg-indigo-600' }
    ]
  },
  haven_checkpoint: {
    id: 'haven_checkpoint', title: 'Eastmere Haven',
    description: 'The golden gates of the Haven loom ahead.',
    icon: '🏰',
    choices: [
      { id: 'continue_loop', text: 'Resupply and Go Further', consequenceText: 'You rest for a night and head back.', action: 'continue_journey', foodGain: 50, color: 'bg-emerald-500' },
      { id: 'retire_journey', text: 'Settle Down Forever', consequenceText: 'Your journey ends here.', action: 'end_journey', color: 'bg-amber-400' }
    ]
  }
};
