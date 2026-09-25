// test_milestone8.js - Comprehensive automated verification for Milestone 8
// Uses native fetch (Node 18+) without requiring external dependencies

const API_BASE = 'http://localhost:5000/api';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  const res = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  return {
    status: res.status,
    ok: res.ok,
    data
  };
};

const runTests = async () => {
  console.log('====================================================');
  console.log('STARTING MILESTONE 8 AUTOMATED TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, description) => {
    if (condition) {
      console.log(`[PASS] ${description}`);
      passed++;
    } else {
      console.error(`[FAIL] ${description}`);
      failed++;
    }
  };

  const timestamp = Date.now();
  const orgEmail = `m8_org_${timestamp}@test.com`;
  const student1Email = `m8_stu1_${timestamp}@test.com`;
  const student2Email = `m8_stu2_${timestamp}@test.com`;

  let orgToken, orgId;
  let stu1Token, stu1Id;
  let stu2Token, stu2Id;
  let eventId;
  let orgRegNotifId;

  try {
    // 1. Health endpoint still works
    const healthRes = await request('/health');
    assert(
      healthRes.status === 200 && healthRes.data?.status === 'success',
      'Test 1: Health endpoint is operational'
    );

    // 2. Auth still works (register organizer, student 1, student 2)
    const orgReg = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'M8 Test Organizer',
        email: orgEmail,
        password: 'password123',
        role: 'organizer'
      }
    });
    orgToken = orgReg.data?.token;
    orgId = orgReg.data?.user?.id;

    const stu1Reg = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'M8 Test Student 1',
        email: student1Email,
        password: 'password123',
        role: 'student'
      }
    });
    stu1Token = stu1Reg.data?.token;
    stu1Id = stu1Reg.data?.user?.id;

    const stu2Reg = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'M8 Test Student 2',
        email: student2Email,
        password: 'password123',
        role: 'student'
      }
    });
    stu2Token = stu2Reg.data?.token;
    stu2Id = stu2Reg.data?.user?.id;

    // Login check
    const orgLogin = await request('/auth/login', {
      method: 'POST',
      body: {
        email: orgEmail,
        password: 'password123'
      }
    });

    assert(
      orgToken && stu1Token && stu2Token && orgLogin.data?.token,
      'Test 2: Authentication (Register & Login) functions properly'
    );

    // 3. Organizer creates event
    const eventRes = await request('/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: {
        title: `M8 Tech Symposium ${timestamp}`,
        description: 'Annual milestone 8 verification conference.',
        date: '2026-11-15',
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        location: 'Innovation Hall A',
        category: 'Technical',
        capacity: 10
      }
    });
    eventId = eventRes.data?.data?._id;
    assert(
      eventRes.status === 201 && eventId,
      'Test 3: Organizer successfully creates event'
    );

    // 4. Student registers for event
    const regRes = await request(`/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      regRes.status === 200 && regRes.data?.status === 'success',
      'Test 4: Student 1 registers for the event'
    );

    // 5. Organizer receives registration notification
    const orgNotifs1 = await request('/notifications', {
      headers: { Authorization: `Bearer ${orgToken}` }
    });
    const regNotif = orgNotifs1.data?.data?.find(
      (n) => n.type === 'event_registration' && n.event?._id === eventId
    );
    if (regNotif) {
      orgRegNotifId = regNotif._id;
    }
    assert(
      regNotif && regNotif.title === 'New Event Registration',
      'Test 5: Organizer receives "New Event Registration" notification'
    );

    // 6. Student cancels registration
    const cancelRes = await request(`/events/${eventId}/register`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      cancelRes.status === 200 && cancelRes.data?.status === 'success',
      'Test 6: Student 1 cancels event registration'
    );

    // 7. Organizer receives cancellation notification
    const orgNotifs2 = await request('/notifications', {
      headers: { Authorization: `Bearer ${orgToken}` }
    });
    const cancelNotif = orgNotifs2.data?.data?.find(
      (n) => n.type === 'registration_cancelled' && n.event?._id === eventId
    );
    assert(
      cancelNotif && cancelNotif.title === 'Event Registration Cancelled',
      'Test 7: Organizer receives "Event Registration Cancelled" notification'
    );

    // Student 1 and Student 2 register again for testing update & delete
    await request(`/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    await request(`/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${stu2Token}` }
    });

    // 8 & 9. Organizer updates event -> Registered student receives update notification
    const updateRes = await request(`/events/${eventId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: {
        title: `M8 Tech Symposium Updated ${timestamp}`,
        location: 'Innovation Main Auditorium'
      }
    });
    assert(updateRes.status === 200, 'Test 8: Organizer updates event details');

    const stu1Notifs1 = await request('/notifications', {
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    const stu1UpdateNotif = stu1Notifs1.data?.data?.find(
      (n) => n.type === 'event_updated' && n.event?._id === eventId
    );
    assert(
      stu1UpdateNotif && stu1UpdateNotif.title === 'Event Updated',
      'Test 9: Registered student receives "Event Updated" notification'
    );

    // 10 & 11. Organizer deletes event -> Previously registered students receive cancellation notification
    const deleteRes = await request(`/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${orgToken}` }
    });
    assert(deleteRes.status === 200, 'Test 10: Organizer deletes event');

    const stu1Notifs2 = await request('/notifications', {
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    const stu1CancelNotif = stu1Notifs2.data?.data?.find(
      (n) => n.type === 'event_cancelled' && n.message.includes('cancelled')
    );
    assert(
      stu1CancelNotif && stu1CancelNotif.title === 'Event Cancelled',
      'Test 11: Previously registered student receives "Event Cancelled" notification'
    );

    // 12. Notification remains readable even though event was deleted
    assert(
      stu1CancelNotif && stu1CancelNotif.event === null,
      'Test 12: Notification remains intact and readable after event deletion'
    );

    // 13. Duplicate notification is NOT generated from duplicate RSVP
    // Create a new event for duplicate RSVP testing
    const event2Res = await request('/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: {
        title: `M8 Duplicate Test Event ${timestamp}`,
        description: 'Testing duplicate RSVP handling.',
        date: '2026-12-01',
        startTime: '02:00 PM',
        location: 'Hall B',
        category: 'Business',
        capacity: 5
      }
    });
    const event2Id = event2Res.data?.data?._id;

    // Student 1 registers once
    await request(`/events/${event2Id}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });

    // Get count of registration notifications for event 2
    const orgNotifsBeforeDup = await request('/notifications', {
      headers: { Authorization: `Bearer ${orgToken}` }
    });
    const regCountBefore = orgNotifsBeforeDup.data?.data?.filter(
      (n) => n.type === 'event_registration' && n.event?._id === event2Id
    ).length || 0;

    // Student 1 tries registering again (should fail with 400)
    const dupRes = await request(`/events/${event2Id}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    const duplicateRejected = dupRes.status === 400;

    const orgNotifsAfterDup = await request('/notifications', {
      headers: { Authorization: `Bearer ${orgToken}` }
    });
    const regCountAfter = orgNotifsAfterDup.data?.data?.filter(
      (n) => n.type === 'event_registration' && n.event?._id === event2Id
    ).length || 0;

    assert(
      duplicateRejected && regCountBefore === regCountAfter,
      'Test 13: Duplicate RSVP is blocked and does NOT generate duplicate notification'
    );

    // 14. A user cannot fetch another user's notifications
    // Student 1 fetches notifications -> should only contain notifications where recipient === stu1Id
    const studentOnlyNotifications = stu1Notifs2.data?.data?.every(
      (n) => n.recipient === stu1Id
    );
    assert(
      studentOnlyNotifications,
      "Test 14: User cannot fetch another user's notifications"
    );

    // 15. A user cannot mark another user's notification as read
    const unauthMarkRes = await request(`/notifications/${orgRegNotifId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      unauthMarkRes.status === 403 || unauthMarkRes.status === 404,
      "Test 15: User cannot mark another user's notification as read (403 Unauthorized)"
    );

    // 16. A user cannot delete another user's notification
    const unauthDeleteRes = await request(`/notifications/${orgRegNotifId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      unauthDeleteRes.status === 403 || unauthDeleteRes.status === 404,
      "Test 16: User cannot delete another user's notification (403 Unauthorized)"
    );

    // 17. Mark one notification as read works
    const unreadBeforeMark = stu1Notifs2.data?.data?.find((n) => !n.isRead);
    let singleMarkSucceeded = false;
    if (unreadBeforeMark) {
      const markRes = await request(`/notifications/${unreadBeforeMark._id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${stu1Token}` }
      });
      singleMarkSucceeded =
        markRes.status === 200 && markRes.data?.data?.isRead === true;
    }
    assert(
      singleMarkSucceeded,
      'Test 17: Mark single notification as read updates isRead to true'
    );

    // 18. Mark all as read works
    const markAllRes = await request('/notifications/read-all', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      markAllRes.status === 200 && markAllRes.data?.status === 'success',
      'Test 18: Mark all notifications as read completes successfully'
    );

    // 19. Unread count is accurate
    const countRes = await request('/notifications/unread-count', {
      headers: { Authorization: `Bearer ${stu1Token}` }
    });
    assert(
      countRes.status === 200 && countRes.data?.unreadCount === 0,
      'Test 19: Unread count accurately reflects 0 after mark-all-read'
    );

  } catch (error) {
    console.error('[UNEXPECTED TEST ERROR]', error);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
