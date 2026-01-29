import type { VercelRequest, VercelResponse } from '@vercel/node';

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_URL = 'https://api.pipedrive.com/v1';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check API token
  if (!PIPEDRIVE_API_TOKEN) {
    console.error('PIPEDRIVE_API_TOKEN not configured');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const { email, phone, website } = req.body;

    // Validate required fields
    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    // Extract name from email (before @) or use email as name
    const name = email.split('@')[0] || email;

    // Create Person in Pipedrive
    const personData = {
      name: name,
      email: [{ value: email, primary: true, label: 'work' }],
      phone: [{ value: phone, primary: true, label: 'work' }],
      // Store website in the visible_to note or custom field
      // For now, we'll add it to the person's name or use org
      visible_to: 3, // 3 = entire company
    };

    const response = await fetch(
      `${PIPEDRIVE_API_URL}/persons?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('Pipedrive API error:', result);
      return res.status(400).json({
        error: 'Failed to create contact',
        details: result.error || 'Unknown error'
      });
    }

    const personId = result.data.id;

    // Add a note with the website info
    if (website) {
      await fetch(
        `${PIPEDRIVE_API_URL}/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `Website: ${website}\n\nSource: B2B Landing Page - Audit Form`,
            person_id: personId,
            pinned_to_person_flag: true,
          }),
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Contact created successfully',
      personId: personId
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
