import { supabase } from '../lib/supabase';

/**
 * Crea un nuevo sorteo en la base de datos
 * @param {Object} raffleData - Datos del sorteo
 * @returns {Promise<Object>} Sorteo creado
 */
export async function createRaffle(raffleData) {
  const { data, error } = await supabase
    .from('raffles')
    .insert([
      {
        name: raffleData.name,
        description: raffleData.description || '',
        monthly_amount: raffleData.monthlyAmount || 0,
        start_month: raffleData.startMonth,
        start_year: raffleData.startYear,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Crea participantes para un sorteo
 * @param {string} raffleId - ID del sorteo
 * @param {Array} participants - Lista de participantes
 * @returns {Promise<Array>} Participantes creados
 */
export async function createParticipants(raffleId, participants) {
  const participantsData = participants.map(p => ({
    raffle_id: raffleId,
    name: p.name,
    email: p.email || null,
    phone: p.phone || null,
    slots: p.slots
  }));

  const { data, error } = await supabase
    .from('participants')
    .insert(participantsData)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Guarda los resultados del sorteo
 * @param {string} raffleId - ID del sorteo
 * @param {Array} results - Resultados del sorteo
 * @returns {Promise<Array>} Resultados guardados
 */
export async function saveRaffleResults(raffleId, results) {
  const resultsData = results.map(r => ({
    raffle_id: raffleId,
    participant_id: r.participant_id,
    month: r.month,
    year: r.year,
    month_display: r.display,
    slot_number: r.slotNumber,
    total_slots: r.totalSlots,
    month_index: r.monthIndex
  }));

  const { data, error } = await supabase
    .from('raffle_results')
    .insert(resultsData)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Guarda un sorteo completo (raffle + participantes + resultados)
 * @param {Object} raffleInfo - Información del sorteo
 * @param {Array} participants - Participantes
 * @param {Array} results - Resultados del sorteo
 * @returns {Promise<Object>} Datos guardados
 */
export async function saveCompleteRaffle(raffleInfo, participants, results) {
  try {
    // 1. Crear el sorteo
    const raffle = await createRaffle(raffleInfo);

    // 2. Crear los participantes
    const savedParticipants = await createParticipants(raffle.id, participants);

    // 3. Mapear participantes con sus IDs de la BD
    const participantMap = {};
    savedParticipants.forEach(sp => {
      participantMap[sp.name] = sp.id;
    });

    // 4. Actualizar resultados con participant_id correcto
    const resultsWithIds = results.map(r => ({
      ...r,
      participant_id: participantMap[r.participantName]
    }));

    // 5. Guardar resultados
    const savedResults = await saveRaffleResults(raffle.id, resultsWithIds);

    return {
      raffle,
      participants: savedParticipants,
      results: savedResults
    };
  } catch (error) {
    console.error('Error saving raffle:', error);
    throw error;
  }
}

/**
 * Obtiene todos los sorteos
 * @returns {Promise<Array>} Lista de sorteos
 */
export async function getAllRaffles() {
  const { data, error } = await supabase
    .from('raffles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Obtiene un sorteo con sus participantes y resultados
 * @param {string} raffleId - ID del sorteo
 * @returns {Promise<Object>} Sorteo completo
 */
export async function getRaffleById(raffleId) {
  const { data: raffle, error: raffleError } = await supabase
    .from('raffles')
    .select('*')
    .eq('id', raffleId)
    .single();

  if (raffleError) throw raffleError;

  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .eq('raffle_id', raffleId);

  if (participantsError) throw participantsError;

  const { data: results, error: resultsError } = await supabase
    .from('raffle_results')
    .select('*')
    .eq('raffle_id', raffleId)
    .order('month_index', { ascending: true });

  if (resultsError) throw resultsError;

  return {
    raffle,
    participants,
    results
  };
}

/**
 * Elimina un sorteo (cascada elimina participantes y resultados)
 * @param {string} raffleId - ID del sorteo
 * @returns {Promise<void>}
 */
export async function deleteRaffle(raffleId) {
  const { error } = await supabase
    .from('raffles')
    .delete()
    .eq('id', raffleId);

  if (error) throw error;
}
