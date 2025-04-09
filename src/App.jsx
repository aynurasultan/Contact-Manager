import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { IoIosMenu } from "react-icons/io";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { IoIosPersonAdd } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai"; // E-posta simgesi
import axios from "axios";
import Card from "./components/card";

const App = () => {
  const [contact, setContact] = useState([]); // Tüm kişileri tutan state
  const [filteredContacts, setFilteredContacts] = useState([]); // Aramaya göre filtrelenmiş kişiler
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    position: "",
    company: "",
  });
  const [search, setSearch] = useState(""); // Arama metni

  useEffect(() => {
    axios.get("http://localhost:3000/contact").then((res) => {
      setContact(res.data);
      setFilteredContacts(res.data); // Sayfa ilk açıldığında tüm kişileri göster
    });
  }, []);

  // Modal açma ve kapama
  const openModal = (contact = null) => {
    setEditingContact(contact);
    if (contact) {
      setFormData({
        name: contact.name,
        surname: contact.surname,
        email: contact.email,
        phone: contact.phone,
        position: contact.position,
        company: contact.company,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      name: "",
      surname: "",
      email: "",
      phone: "",
      position: "",
      company: "",
    });
  };

  // Form veri değişikliklerini yakalamak
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Kişiyi güncelleme
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/contact/${editingContact.id}`, formData)
      .then((res) => {
        const updatedContacts = contact.map((item) =>
          item.id === res.data.id ? res.data : item
        );
        setContact(updatedContacts);
        setFilteredContacts(updatedContacts); // Filtreyi de güncelle
        closeModal(); // Güncelleme başarılıysa modalı kapat
      })
      .catch((error) => console.error("Güncelleme hatası:", error));
  };

  // Kişiyi silme
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/contact/${id}`)
      .then(() => {
        const updatedContacts = contact.filter((item) => item.id !== id);
        setContact(updatedContacts);
        setFilteredContacts(updatedContacts); // Filtreyi de güncelle
      })
      .catch((error) => console.error("Silme hatası:", error));
  };

  // Yeni kişi ekleme
  const handleSave = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/contact", formData)
      .then((res) => {
        setContact([...contact, res.data]);
        setFilteredContacts([...contact, res.data]); // Filtreyi de güncelle
        closeModal(); // Yeni kişi eklendikten sonra modalı kapat
      })
      .catch((error) => console.error("Yeni kişi ekleme hatası:", error));
  };

  // Arama fonksiyonu
  const handleSearch = (e) => {
    const searchText = e.target.value;
    setSearch(searchText);

    // Kişileri filtrele
    const filtered = contact.filter(contact => {
      return (
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.surname.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setFilteredContacts(filtered); // Aramaya göre filtrelenmiş kişileri güncelle
  };

  return (
    <div className={`app ${showModal ? "modal-open" : ""}`}>
      <header>
        <h1>Rehber</h1>
        <div>
          <form>
            <button>
              <RiSearchLine />
            </button>
            <input
              type="search"
              placeholder="Kişi aratınız ..."
              value={search}
              onChange={handleSearch} // Arama kutusundaki değeri değiştirdiğinde filtre uygula
            />
          </form>
          <button className="ns">
            <IoIosMenu />
          </button>
          <button className="ns">
            <HiMiniSquares2X2 />
          </button>
          <button className="add" onClick={() => openModal()}>
            <IoIosPersonAdd className="icon" />
            <span>Yeni kişi</span>
          </button>
        </div>
      </header>

      <main>
        {filteredContacts.length === 0 ? (
          <p>Kişi bulunamadı</p>
        ) : (
          filteredContacts.map((item) => (
            <Card key={item.id} item={item} onEdit={() => openModal(item)} onDelete={handleDelete} />
          ))
        )}
      </main>

      {/* Modal (yeni kişi ekleme / düzenleme) */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingContact ? "Kişi Güncelle" : "Yeni Kişi Ekle"}</h2>
              <button className="close" onClick={closeModal}>X</button>
            </div>
            <form onSubmit={editingContact ? handleUpdate : handleSave}>
              <div className="input-group">
                <label htmlFor="name">Ad</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="surname">Soyad</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">E-posta</label>
                <div className="email-input">
                  <AiOutlineMail />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="position">Pozisyon</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="company">Şirket</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">
                  Vazgeç
                </button>
                <button type="submit" className="save-btn">
                  {editingContact ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
