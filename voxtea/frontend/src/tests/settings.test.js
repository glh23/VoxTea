import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Settings from "../pages/Settings";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeContext from "../components/themeContext";

// Mock axios
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockThemeContextValue = {
  theme: "light",
  toggleTheme: jest.fn(),
};

describe("Settings Component", () => {
  beforeAll(() => {
    sessionStorage.setItem("authToken", "mockToken");
    localStorage.setItem("spotifyAccessToken", "mockSpotifyToken");
  });

  afterAll(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      switch (url) {
        case "http://localhost:5000/api/users/getProfilePicture":
          return Promise.resolve({ data: { profilePicture: "test.png" } });
        case "http://localhost:5000/api/users/hashtags/get":
          return Promise.resolve({ data: { hashtags: ["#test", "#sample"] } });
        case "http://localhost:5000/api/spotify/userInfo":
          return Promise.resolve({ data: { display_name: "Test User" } });
        default:
          return Promise.resolve({ data: {} });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Router>
        <ThemeContext.Provider value={mockThemeContextValue}>
          <Settings />
        </ThemeContext.Provider>
      </Router>
    );

  it("renders Settings page content", async () => {
    renderComponent();

    expect(await screen.findByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Profile Picture")).toBeInTheDocument();
    expect(screen.getByText("Hashtags")).toBeInTheDocument();
  });

it("uploads a profile picture", async () => {
  const file = new File(["dummy content"], "profile.jpg", { type: "image/jpeg" });

  axios.post.mockResolvedValueOnce({
    data: {
      profilePicture: "profile.jpg",
      message: "Profile picture updated successfully",
    },
  });

  renderComponent();

  const fileInput = screen.getByLabelText(/upload/i); 
  fireEvent.change(fileInput, { target: { files: [file] } });

  const uploadButton = screen.getByTestId("upload-button"); 
  fireEvent.click(uploadButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/users/updateProfilePicture",
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          Authorization: "mockToken",
          "Content-Type": "multipart/form-data",
        },
      })
    );
    expect(screen.getByAltText("Profile").src).toContain("profile.jpg");
  });
});


  it("adds and deletes hashtags", async () => {
    axios.post
      .mockResolvedValueOnce({ data: { message: "Hashtags saved successfully" } }) // Save
      .mockResolvedValueOnce({ data: { message: "Hashtag deleted successfully" } }); // Delete

    renderComponent();

    const input = screen.getByPlaceholderText(/Enter hashtags/i);
    fireEvent.change(input, { target: { value: "#test #newhashtag" } });

    const saveBtn = screen.getByText(/Save Hashtags/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/hashtags/update",
        { hashtags: ["#test", "#newhashtag"] },
        expect.objectContaining({
          headers: { Authorization: "mockToken" },
        })
      );
    });

    const viewBtn = screen.getByText(/View Hashtags/i);
    fireEvent.click(viewBtn);

    const hashtagChip = screen.getByText("#test");
    fireEvent.click(hashtagChip);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/users/hashtags/delete",
        { hashtag: "#test" },
        expect.objectContaining({
          headers: { Authorization: "mockToken" },
        })
      );
    });
  });

  it("connects to Spotify", async () => {
    renderComponent();

    const spotifyLogin = screen.getByText(/Spotify Login/i);
    fireEvent.click(spotifyLogin);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:5000/api/spotify/userInfo",
        expect.anything()
      );
    });
  });

  it("shows delete user confirmation popup", () => {
    renderComponent();

    const deleteBtn = screen.getByText(/Delete User/i);
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/Are you sure you want to delete your account/i)).toBeInTheDocument();
  });

  it("toggles between light and dark mode", () => {
    renderComponent();

    const toggleBtn = screen.getByText(/Switch to Dark Mode/i);
    fireEvent.click(toggleBtn);

    expect(mockThemeContextValue.toggleTheme).toHaveBeenCalled();
  });

});


