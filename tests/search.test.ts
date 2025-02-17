import { v4 } from 'uuid'
import { describe, expect, it } from 'vitest'
import MiniSearch from 'minisearch'

const notes = [
  {
    id: v4(),
    content: `Tokyo, Japan's bustling capital, is a mesmerizing blend of ultramodern skyscrapers and traditional temples. It's a city where neon-lit nightlife districts like Shibuya coexist with serene gardens and historic sites such as the Imperial Palace. Tokyo is also a global culinary hotspot, offering everything from Michelin-starred restaurants to tiny ramen shops, making it a truly captivating and diverse metropolis.`
  },
  {
    id: v4(),
    content: `Osaka, Japan's vibrant second city, is known for its friendly locals, delicious street food, and lively nightlife.  It's a city where you can explore the historic Osaka Castle, indulge in takoyaki and okonomiyaki, and experience the energetic atmosphere of districts like Dotonbori. Osaka offers a unique and more down-to-earth experience compared to Tokyo or Kyoto, showcasing a different facet of Japanese culture.`
  },
  {
    id: v4(),
    content: `Fukuoka, the vibrant capital of Kyushu, is a city that beautifully blends rich history with modern attractions. It's famous for its delicious food, especially Hakata ramen and its unique yatai food stalls, offering a lively culinary experience. Fukuoka also boasts beautiful parks like Ohori Park and historical sites such as Kushida Shrine, making it a captivating destination for both food lovers and culture seekers.`
  },
  {
    id: v4(),
    content: `Sapporo, on the island of Hokkaido, is famous for its annual Snow Festival, showcasing incredible ice sculptures.  It's also renowned for its delicious local cuisine, including miso ramen and Jingisukan (grilled mutton), and its refreshing Sapporo beer.  Beyond the city, Sapporo serves as a gateway to stunning natural landscapes, offering access to skiing, hiking, and other outdoor activities.`
  },
  {
    id: v4(),
    content: `Nagoya, a major industrial hub in central Japan, is a city where history and innovation intertwine. It's home to the impressive Nagoya Castle, a symbol of the city's samurai heritage, and the Toyota Commemorative Museum of Industry and Technology, showcasing its modern manufacturing prowess. Nagoya is also known for its unique culinary scene, offering dishes like miso katsu and tebasaki (spicy chicken wings), providing a distinct gastronomic experience.`
  },
  {
    id: v4(),
    content: `Kobe, nestled between mountains and sea, is a cosmopolitan city known for its picturesque harbor and delicious Kobe beef.  It's a city that blends international influences with Japanese charm, evident in its stylish architecture and diverse culinary scene.  Kobe also offers access to beautiful nature, with hiking trails in the surrounding mountains and scenic views of the bay.`
  },
  {
    id: v4(),
    content: `Kyoto, the former imperial capital of Japan, exudes a timeless elegance with its serene temples, meticulously raked Zen gardens, and traditional wooden machiya houses.  The city is a living museum of Japanese culture, where geishas gracefully navigate the Gion district and ancient festivals like the Aoi Matsuri continue to thrive.  From the iconic Kinkaku-ji (Golden Pavilion) to the enchanting Arashiyama Bamboo Grove, Kyoto offers an unparalleled journey into the heart of traditional Japan.`
  },
  {
    id: v4(),
    content: `Yokohama, Japan's second-largest city, is a vibrant port city with a cosmopolitan atmosphere and a rich history of international exchange.  It boasts a scenic waterfront with modern architecture, including the iconic Landmark Tower, and historic areas like the Red Brick Warehouse district. Yokohama is also known for its diverse culinary scene, offering everything from authentic Chinese cuisine in Chinatown to innovative fusion dishes.`
  },
  {
    id: v4(),
    content: `Hiroshima, a city reborn from tragedy, stands as a symbol of peace and resilience.  It's a city where the Hiroshima Peace Memorial Park and Museum serve as poignant reminders of the atomic bombing and powerful advocates for a world without nuclear weapons.  Beyond its historical significance, Hiroshima offers a vibrant cultural scene, delicious local cuisine like okonomiyaki, and the beautiful island of Miyajima with its iconic floating torii gate.`
  },
  {
    id: v4(),
    content: `Sendai, the largest city in the Tohoku region, is known as the "City of Trees" for its lush greenery and beautiful parks. It offers a blend of modern urban life and natural beauty, with attractions like the historic Zuihoden Mausoleum and the scenic Matsushima Bay nearby. Sendai is also famous for its delicious cuisine, including gyutan (grilled beef tongue) and zunda (sweet bean paste), making it a delightful destination for both nature lovers and food enthusiasts.`
  },
  {
    id: v4(),
    content: `Kanazawa, a beautifully preserved city on the coast of Ishikawa Prefecture, is known for its rich samurai history and exquisite Kenrokuen Garden, considered one of Japan's three most beautiful landscape gardens.  The city boasts well-preserved samurai districts like Nagamachi, offering a glimpse into feudal Japan, and the Higashi Chaya District, known for its traditional teahouses. Kanazawa also offers a thriving arts and crafts scene, with opportunities to experience traditional crafts like gold leaf application and Kutani ware pottery.`
  },
  {
    id: v4(),
    content: `Hamamatsu, located in Shizuoka Prefecture, is known for its beautiful natural surroundings, including Lake Hamana and the Enshu sand dunes. It's a city with a strong connection to music, being the birthplace of Yamaha and home to many musical instrument manufacturers.  Hamamatsu also offers a variety of attractions, from the Hamamatsu Flower Park to the historic Hamamatsu Castle, providing a blend of natural beauty, cultural experiences, and industrial heritage.`
  },
  {
    id: v4(),
    content: `Kumamoto, located in the heart of Kyushu, is known for its majestic Kumamoto Castle, a symbol of the city's history and resilience, though parts are still under reconstruction after a major earthquake.  The city boasts beautiful natural surroundings, including the serene Suizenji Jojuen Garden, a picturesque traditional landscape garden. Kumamoto is also recognized for its delicious local cuisine, particularly its flavorful ramen and fresh seafood.`
  },
  {
    id: v4(),
    content: `Nagasaki, a city dramatically shaped by its history, offers a poignant reminder of the atomic bombing while also showcasing a spirit of resilience and rebirth.  It's a city where the Nagasaki Peace Park and Atomic Bomb Museum stand as powerful testaments to the past and advocates for peace.  Beyond its historical significance, Nagasaki boasts a unique blend of cultures, influenced by its past as a port open to international trade, evident in its diverse architecture and culinary scene.`
  },
  {
    id: v4(),
    content: `Kitakyushu, located at the northern tip of Kyushu, is a major industrial city with a rich history and a vibrant present.  It's a city where modern industry blends with natural beauty, offering attractions like the scenic Mojiko Retro district and the lush Hirao-dai plateau. Kitakyushu is also a transportation hub, serving as a gateway to other parts of Kyushu and Honshu.`
  },
  {
    id: v4(),
    content: `Nara, Japan's first permanent capital, is renowned for its friendly wild deer roaming freely in Nara Park, a truly unique and memorable experience. The city is home to numerous significant Buddhist temples, including Todai-ji Temple, housing a giant bronze Buddha statue, and Kasuga Taisha Shrine, famous for its thousands of lanterns. Nara offers a captivating glimpse into Japan's ancient past and is a must-visit for anyone interested in history and culture.`
  },
  {
    id: v4(),
    content: `Chiba, the capital of Chiba Prefecture, is a coastal city offering a mix of urban amenities and natural beauty.  It's known for its convenient access to Narita International Airport and its large-scale shopping malls and entertainment complexes, making it a popular destination for both travelers and locals.  Chiba also boasts scenic spots like the Chiba Port Tower and the Makuhari Bay area, providing beautiful views and recreational opportunities.`
  },
  {
    id: v4(),
    content: `Okayama, located in the Chugoku region, is known for its beautiful Korakuen Garden, one of Japan's three most famous gardens. It's a city with a rich history, featuring the impressive Okayama Castle and the preserved samurai district of Bikan Historical Area. Okayama is also a gateway to the scenic Seto Inland Sea, offering access to islands like Naoshima, known for its contemporary art.`
  },
  {
    id: v4(),
    content: `Saitama Prefecture, just north of Tokyo, offers a mix of urban and rural landscapes, with bustling cities like Saitama City and charming towns nestled in the mountains. It's known for its beautiful parks, such as the sprawling Omiya Park, and historical sites like the ancient Hikawa Shrine. Saitama is also a convenient base for exploring the surrounding areas, with easy access to Tokyo and other destinations.`
  },
  {
    id: v4(),
    content: `Kawasaki, situated between Tokyo and Yokohama, is a major industrial city and port known for its diverse offerings. It boasts the unique Kanamara Matsuri (Festival of the Steel Phallus), a lively celebration of fertility. Kawasaki also features the serene Kawasaki Daishi temple and the modern entertainment complex of Lazona Kawasaki Plaza.`
  },
  {
    id: v4(),
    content: `Sakai, a historic city in Osaka Prefecture, is known for its traditional crafts, particularly its high-quality knives and scissors. It's also a city with a rich history, featuring the Daisen Park, a beautiful traditional Japanese garden. Sakai offers a glimpse into Japan's craftsmanship and history.`
  },
  {
    id: v4(),
    content: `Niigata, a port city on the coast of the Sea of Japan, is known for its rice and sake production. It's also a city with a rich cultural heritage, featuring the Northern Culture Museum, showcasing the history and culture of the region. Niigata offers a taste of authentic Japanese culture and cuisine.`
  },
  {
    id: v4(),
    content: `Oita, a city on the island of Kyushu, is known for its hot springs and natural beauty. It's a popular destination for onsen lovers, with many famous hot spring resorts nearby. Oita also offers a variety of attractions, from its beautiful coastline to its historic temples.`
  },
  {
    id: v4(),
    content: `Takasaki, a city in Gunma Prefecture, is known for its daruma dolls, symbols of good luck and perseverance. It's also a transportation hub, with easy access to other parts of Japan. Takasaki offers a glimpse into Japanese folk culture and craftsmanship.`
  },
  {
    id: v4(),
    content: `Utsunomiya, a city in Tochigi Prefecture, is known for its gyoza dumplings, a popular Japanese dish. It's also a city with a rich history, featuring the Utsunomiya Futaarayama Shrine, a historic Shinto shrine. Utsunomiya offers a taste of authentic Japanese cuisine and culture.`
  },
  {
    id: v4(),
    content: `Kagoshima, a city in southern Kyushu, is known for its active volcano, Sakurajima, and its beautiful natural surroundings. It's also a city with a rich history, featuring the Sengan-en Garden, a historic Japanese garden. Kagoshima offers a glimpse into Japan's volcanic landscape and history.`
  },
  {
    id: v4(),
    content: `Fukushima, a city in Fukushima Prefecture, is known for its natural beauty and resilience, having recovered from the 2011 earthquake and tsunami. It's also a city with a rich history, featuring the Tsurugajo Castle, a historic castle. Fukushima offers a glimpse into Japan's natural beauty and spirit of resilience.`
  },
  {
    id: v4(),
    content: `Miyazaki, a city in Miyazaki Prefecture, is known for its warm climate and beautiful coastline. It's a popular destination for surfers and beach lovers. Miyazaki also offers a variety of attractions, from its beautiful parks to its historic temples.`
  },
  {
    id: v4(),
    content: `Akita, a city in Akita Prefecture, is known for its winter festivals and traditional crafts. It's also a city with a rich history, featuring the Akita Castle, a historic castle. Akita offers a glimpse into Japanese winter culture and craftsmanship.`
  },
  {
    id: v4(),
    content: `Toyama, a city on the coast of the Sea of Japan, is known for its beautiful mountains and fresh seafood. It's also a city with a rich cultural heritage, featuring the Toyama Castle, a historic castle. Toyama offers a glimpse into Japan's natural beauty and culinary traditions.`
  }
]

const miniSearch = new MiniSearch({
  fields: ['content'],
  storeFields: ['content']
})

miniSearch.addAll(notes)

describe('search', () => {
  it('', () => {
    const results = miniSearch.search('ramen')
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('raamen', { fuzzy: 0.2 })
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('raaamen', { fuzzy: 0.2 })
    expect(results.length).toBe(0)
  })
  it('', () => {
    const results = miniSearch.search('raaaamen', { fuzzy: 0.4 })
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('seafood')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('ramen seafood')
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('sea')
    expect(results.length).toBe(4)
  })
  it('', () => {
    const results = miniSearch.search('sea', { prefix: true })
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('temple')
    expect(results.length).toBe(2)
  })
  it('', () => {
    const results = miniSearch.search('temples')
    expect(results.length).toBe(5)
  })
  it('', () => {
    const results = miniSearch.search('temple', { fuzzy: 0.2 })
     expect(results.length).toBe(6)
  })
  it('', () => {
    const results = miniSearch.search('temp', { prefix: true })
     expect(results.length).toBe(6)
  })
  it('', () => {
    const results = miniSearch.search('castle')
    expect(results.length).toBe(8)
  })
  it('', () => {
    const results = miniSearch.search('snow')
    expect(results.length).toBe(1)
  })
  it('', () => {
    const before = miniSearch.search('naha')
    expect(before.length).toBe(0)
    const newNote = {
      id: v4(),
      content: `Naha is the capital city of Okinawa Prefecture, Japan, and is known for its unique blend of Japanese and Okinawan cultures. It is a vibrant city with a rich history, beautiful beaches, and a bustling shopping street called Kokusai Street. Naha is also home to the historic Shurijo Castle, a UNESCO World Heritage Site.`
    }
    miniSearch.add(newNote)
    const after = miniSearch.search('naha')
    expect(after.length).toBe(1)
  })
  it('', () => {
    const before = miniSearch.search('sapporo')
    expect(before.length).toBe(1)
    const id = before[0].id
    miniSearch.discard(id)
    const after = miniSearch.search('sapporo')
    expect(after.length).toBe(0)
  })
  it('', () => {
    const json = miniSearch.toJSON()
    expect(json.documentCount).toBe(30)
    expect(json.index.length).toBeGreaterThan(500)
    expect(json.serializationVersion).toBe(2)
  })
  it('', () => {
    const before = miniSearch.search('shinjuku')
    expect(before.length).toBe(0)
    const id = notes[0].id
    const updated = {id: id, content: `Tokyo, Japan's bustling capital, is a mesmerizing blend of ultramodern skyscrapers and traditional temples. It's a city where neon-lit nightlife districts like Shibuya coexist with serene gardens and historic sites such as the Imperial Palace.  Shinjuku, a major commercial and administrative center, is also home to the Tokyo Metropolitan Government Building and offers stunning panoramic views of the city. Tokyo is also a global culinary hotspot, offering everything from Michelin-starred restaurants to tiny ramen shops, making it a truly captivating and diverse metropolis.`}
    miniSearch.replace(updated)
    const after = miniSearch.search('shinjuku')
    expect(after.length).toBe(1)
  })
})
