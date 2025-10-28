/**
 * Generates months starting from November 2025
 * @param {number} count - Number of months to generate
 * @returns {Array} Array of month objects
 */
export function generateMonths(count) {
  const months = [];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  let year = 2025;
  let month = 10; // November (0-indexed)

  for (let i = 0; i < count; i++) {
    months.push({
      month: month,
      year: year,
      display: `${monthNames[month]} ${year}`,
      index: i
    });

    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
  }

  return months;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Checks if an assignment is valid (no consecutive months for same participant)
 * @param {Array} results - Array of assignment results
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidAssignment(results) {
  const participantMonths = {};

  results.forEach(result => {
    if (!participantMonths[result.participantId]) {
      participantMonths[result.participantId] = [];
    }
    participantMonths[result.participantId].push(result.monthIndex);
  });

  for (const participantId in participantMonths) {
    const monthIndices = participantMonths[participantId].sort((a, b) => a - b);

    if (monthIndices.length > 1) {
      for (let i = 1; i < monthIndices.length; i++) {
        if (monthIndices[i] - monthIndices[i - 1] === 1) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Assigns months using backtracking algorithm
 * @param {Array} slots - Array of participant slots
 * @param {Array} months - Array of months
 * @returns {Array|null} Valid assignment or null if not found
 */
export function assignWithBacktracking(slots, months) {
  const n = slots.length;
  const assignment = new Array(n).fill(null);
  const used = new Array(n).fill(false);

  function backtrack(monthIndex) {
    if (monthIndex === n) {
      return true;
    }

    for (let slotIdx = 0; slotIdx < n; slotIdx++) {
      if (used[slotIdx]) continue;

      const slot = slots[slotIdx];
      let isValid = true;

      if (monthIndex > 0 && assignment[monthIndex - 1]) {
        if (assignment[monthIndex - 1].participantId === slot.participantId) {
          isValid = false;
        }
      }

      if (isValid) {
        assignment[monthIndex] = slot;
        used[slotIdx] = true;

        if (backtrack(monthIndex + 1)) {
          return true;
        }

        assignment[monthIndex] = null;
        used[slotIdx] = false;
      }
    }

    return false;
  }

  if (backtrack(0)) {
    return months.map((month, index) => ({
      ...month,
      ...assignment[index],
      monthIndex: index
    }));
  }

  return null;
}

/**
 * Performs the raffle with non-consecutive months constraint
 * @param {Array} participants - Array of participants with their slots
 * @returns {Object} Result object with success status and results/error
 */
export function performRaffle(participants) {
  // Create slots array
  let slots = [];
  participants.forEach(participant => {
    for (let i = 0; i < participant.slots; i++) {
      slots.push({
        participantId: participant.id,
        participantName: participant.name,
        slotNumber: i + 1,
        totalSlots: participant.slots
      });
    }
  });

  const totalSlots = slots.length;
  const months = generateMonths(totalSlots);

  // Try random assignments first
  const maxAttempts = 1000;
  let validAssignment = false;
  let results = [];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffledSlots = shuffle(slots);
    results = months.map((month, index) => ({
      ...month,
      ...shuffledSlots[index]
    }));

    validAssignment = isValidAssignment(results);

    if (validAssignment) {
      return {
        success: true,
        results: results
      };
    }
  }

  // Try backtracking if random didn't work
  results = assignWithBacktracking(slots, months);

  if (results !== null) {
    return {
      success: true,
      results: results
    };
  }

  return {
    success: false,
    error: 'No se pudo encontrar una asignación válida. Intenta ajustar los participantes.'
  };
}
